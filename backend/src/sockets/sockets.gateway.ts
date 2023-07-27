import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { usernameMiddleware } from './middleware/username.middleware';
import { JwtService } from '@nestjs/jwt';
import { MatchClass } from './sockets.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@WebSocketGateway({
	cors: {
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}
})
export class SocketsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
	constructor(private socketsService: SocketsService, private readonly jwtService: JwtService) { }

	@WebSocketServer() server: Server;

	/* Attribue le nickname au socket ouvert à partir de son jwt */
	afterInit(server: Server) {
		server.use(usernameMiddleware(this.jwtService));
		console.log('WS Initialized');
	}

	/* Indique dans le User scheme qu'il est actif */
	async handleConnection(client: Socket, ...args: any[]) {
		void (args);

		await this.socketsService.activeUser(client.data.userId);
		console.log('Client connected:', client.data.username);

		/* Stocker tous les sockets des users actuellement connectés dans un map */
		this.socketsService.registerActiveSockets(client.data.userId, client.id);

		/* Reconnecter le client à son match s'il en avait un en cours */
		this.socketsService.cleanupMatches();
		const match = this.getMatchByUserId(client.data.userId);
		if (match !== undefined) {
			client.join(match.matchId.toString());
			switch (client.data.userId) {
				case match.player1.userId:
					match.player1.ready = true;
					break;
				case match.player2.userId:
					match.player2.ready = true;
					break;
				default:
					break;
			}
			console.log("Client reconnected to match: ", match.matchId);
		}
		/* TODO: regarder dans quels chans la personne est déjà et la rajouter */

	}

	/* Indique dans le User scheme qu'il est inactif et le déconnecte */
	handleDisconnect(client: Socket) {
		this.socketsService.inactiveUser(client.data.userId);
		this.socketsService.deleteDisconnectedSockets(client.data.userId);

		// Tell the match the user has disconnected
		const match = this.getMatchByUserId(client.data.userId);
		if (match !== undefined) {
			switch (client.data.userId) {
				case match.player1.userId:
					match.player1.ready = false;
					break;
				case match.player2.userId:
					match.player2.ready = false;
					break;
				default:
					break;
			}
		}

		// Remove user from queue if they were in it
		for (let i = 0; i < this.socketsService.queue.length; i++) {
			if (this.socketsService.queue[i].userId === client.data.userId) {
				this.socketsService.queue.splice(i, 1);
				console.log("User removed from queue.");
				break;
			}
		}

		console.log('Client disconnected:', client.data.username);
		client.disconnect(true);
	}

	@SubscribeMessage('Create Lobby')
	async handleLobbyCreation(client: Socket, payload: string): Promise<void> {
		const room = payload;
		client.join(room);
		console.log(client.data.username, ` has joined the room ${payload}!`);
	}
	/* ######################### */
	/* ######### CHAT ########## */
	/* ######################### */

	/**
	 * @description Message à envoyer aux listeners de l'event "receiveMessage"
	 * @param client Socket de la personne qui a envoyé un message dans le Chat
	 * @param payload `<roomName> <messageToTransfer>`. Exemple: "RockLovers Hello comment ça va?"
	 */
	@SubscribeMessage('Chat')
	async handleSendMessage(client: Socket, payload: string): Promise<void> {
		console.log(client.data.username, ':', payload);
		const splitStr: string[] = payload.split('  ');
		
		const action = splitStr[0];
		const room = splitStr[1];
		const msgToTransfer = splitStr[2];
		
		if (action === "/msg") {
			const message = {
				date: new Date(),
				from: client.data.username,
				fromId: client.data.userId,
				content: msgToTransfer,
			};
			this.server.to(room).emit('receiveMessage', message);
		}
	}

	/* ######################### */
	/* ###### MATCHMAKING ###### */
	/* ######################### */

	@SubscribeMessage('Join Queue')
	async handleJoinQueue(client: Socket, payload: string): Promise<void> {
		void (payload);

		const userId = client.data.userId;
		const username = client.data.username;

		// Add user to queue
		this.socketsService.addToQueue(userId, username);

		// Check if there is a match to launch
		this.socketsService.cleanupMatches();
		let match;
		if (this.socketsService.queue.length >= 2) {
			match = this.socketsService.addMatch();
			const socket1: Socket = this.getSocketByUserId(match.player1.userId);
			const socket2: Socket = this.getSocketByUserId(match.player2.userId);

			if (socket1 === undefined || socket2 === undefined) {
				console.log("Error: socket undefined");
				return;
			}

			socket1.join(match.matchId.toString());
			socket2.join(match.matchId.toString());
			this.server.to(match.matchId.toString()).emit('match ready', match);

			console.log("Match ready, waiting for players to accept...");
		}
	}

	@SubscribeMessage('accept match')
	async handleAcceptMatch(client: Socket, payload: string): Promise<void> {
		void (payload);

		const userId = client.data.userId;

		console.log(client.data.username, "accepted the match");

		const match = this.getMatchByUserId(userId);
		if (match === undefined) {
			console.log("Error: match undefined");
			return;
		} else if (match.player1.userId === userId) {
			match.player1.ready = true;
		} else if (match.player2.userId === userId) {
			match.player2.ready = true;
		}

		if (match.player1.ready && match.player2.ready) {
			// this.server.to(match.matchId.toString()).emit('match started');
			const socket1: Socket = this.getSocketByUserId(match.player1.userId);
			const socket2: Socket = this.getSocketByUserId(match.player2.userId);
			socket1.emit('match started', true);
			socket2.emit('match started', false);
			match.lastUpdate = Date.now();
			match.player1.lastUpdate = Date.now();
			match.player2.lastUpdate = Date.now();
			console.log("Match started");
		}
	}

	@SubscribeMessage('Leave Queue')
	async handleLeaveQueue(client: Socket, payload: string): Promise<void> {
		void (payload);

		const userId = client.data.userId;

		// Remove user from queue
		for (let i = 0; i < this.socketsService.queue.length; i++) {
			if (this.socketsService.queue[i].userId === userId) {
				this.socketsService.queue.splice(i, 1);
				console.log("User removed from queue.");
				break;
			}
		}
	}

	/* ######################### */
	/* ######### GAME ########## */
	/* ######################### */

	@SubscribeMessage('game input')
	async handleGameInput(client: Socket, payload: number): Promise<void> {

		const userId = client.data.userId;

		const match = this.getMatchByUserId(userId);

		if (match === undefined) {
			return;
		}

		// Check if one of the players has disconnected for more than 3 seconds
		if (Date.now() - match.player1.lastUpdate > 3000) {
			this.server.to(match.matchId.toString()).emit('match canceled');
			this.socketsService.deleteMatch(match.matchId);
			return;
		}
		if (Date.now() - match.player2.lastUpdate > 3000) {
			match.player2.ready = false;
		}

		// If one of the players is not ready, do not actuate game state (Pause)
		if (match.player1.ready === false || match.player2.ready === false) {

			// If the match has been paused for more than 10 seconds (unresponsive player), cancel it.
			if (Date.now() - match.lastUpdate > 10000) {
				this.server.to(match.matchId.toString()).emit('match canceled');
				this.socketsService.deleteMatch(match.matchId);
				return;
			}

			this.server.to(match.matchId.toString()).emit('game state', match, "pause");
			match.lastUpdate = Date.now();
			return;
		}

		const delta = (Date.now() - match.lastUpdate) / 1000; // in seconds

		// If payload is not empty, actuate user state
		if (payload) {
			switch (userId) {
				case match.player1.userId:
					{
						// Set player 1 paddle position
						match.p1posY = payload;
						break;
					}
				case match.player2.userId:
					{
						// Set player 2 paddle position
						match.p2posY = payload;
						break;
					}
				default:
					break;
			}
		}

		// Actuate ball state here

		// Check collisions first
		if (match.ballY + (match.ballSpeedY * delta) - this.socketsService.gameConstants.ballRadius < 0 || match.ballY + (match.ballSpeedY * delta) + this.socketsService.gameConstants.ballRadius > this.socketsService.gameConstants.height) {
			match.ballSpeedY *= -1.05;
		}
		if (match.ballX + (match.ballSpeedX * delta) - this.socketsService.gameConstants.ballRadius - this.socketsService.gameConstants.paddleWidth < 0) {
			if (match.ballY > match.p1posY && match.ballY < match.p1posY + this.socketsService.gameConstants.paddleLength) {
				// It bounces on the paddle
				match.ballSpeedX *= -1.8;
				match.ballSpeedY *= 1.2;
			}
			else {
				// GOAL!
				match.player2.score += 1;
				this.resetMatch(match);
				if (match.player2.score >= this.socketsService.gameConstants.winScore) {
					match.ballSpeedX = 0;
					match.ballSpeedY = 0;
					this.endMatch(match);
				}
			}
		}
		else if (match.ballX + (match.ballSpeedX * delta) + this.socketsService.gameConstants.ballRadius + this.socketsService.gameConstants.paddleWidth > this.socketsService.gameConstants.width) {
			if (match.ballY > match.p2posY && match.ballY < match.p2posY + this.socketsService.gameConstants.paddleLength) {
				// It bounces on the paddle
				match.ballSpeedX *= -1.8;
				match.ballSpeedY *= 1.2;
			}
			else {
				// GOAL!
				match.player1.score += 1;
				this.resetMatch(match);
				if (match.player1.score >= this.socketsService.gameConstants.winScore) {
					match.ballSpeedX = 0;
					match.ballSpeedY = 0;
					this.endMatch(match);
				}
			}
		}

		// Speed limits
		if (match.ballSpeedX > this.socketsService.gameConstants.maxBallSpeed) {
			match.ballSpeedX = this.socketsService.gameConstants.maxBallSpeed;
		} else if (match.ballSpeedX < -this.socketsService.gameConstants.maxBallSpeed) {
			match.ballSpeedX = -this.socketsService.gameConstants.maxBallSpeed;
		}
		if (match.ballSpeedY > this.socketsService.gameConstants.maxBallSpeed) {
			match.ballSpeedY = this.socketsService.gameConstants.maxBallSpeed;
		} else if (match.ballSpeedY < -this.socketsService.gameConstants.maxBallSpeed) {
			match.ballSpeedY = -this.socketsService.gameConstants.maxBallSpeed;
		}

		match.ballX += match.ballSpeedX * delta;
		match.ballY += match.ballSpeedY * delta;

		match.lastUpdate = Date.now();

		// Send match state to both players
		this.server.to(match.matchId.toString()).emit('game state', match);

		// Send match state to only one player
		// client.emit('game state', match);

		// Upadte player last call
		switch (userId) {
			case match.player1.userId:
				match.player1.lastUpdate = Date.now();
				break;
			case match.player2.userId:
				match.player2.lastUpdate = Date.now();
				break;
			default:
				break;
		}
	}

	/* ######################### */
	/* ######### MISC ########## */
	/* ######################### */

	private getSocketBySocketId(socketId: string): Socket | undefined {
		return this.server.sockets.sockets.get(socketId);
	}

	private getSocketByUserId(userId: number): Socket | undefined {
		const socketId = this.socketsService.currentActiveUsers.get(userId);
		return this.getSocketBySocketId(socketId);
	}

	private getMatchByUserId(userId: number): MatchClass | undefined {
		for (const match of this.socketsService.matches) {
			if (match.player1.userId === userId || match.player2.userId === userId) {
				return match;
			}
		}
		return undefined;
	}

	private resetMatch(match: MatchClass): void {

		match.ballX = this.socketsService.gameConstants.width / 2;
		match.ballY = this.socketsService.gameConstants.height / 2;

		// horizontal ball speed is non null
		match.ballSpeedX = 90;
		// Random vertical ball speed between 10 and 100
		match.ballSpeedY = Math.random() * 90 + 10;
		// Randomize ball direction
		if (Math.random() > 0.5) {
			match.ballSpeedX *= -1;
		}
		if (Math.random() > 0.5) {
			match.ballSpeedY *= -1;
		}

		match.lastUpdate = Date.now();
	}

	private async endMatch(match: MatchClass): Promise<void> {

		const socket1: Socket = this.getSocketByUserId(match.player1.userId);
		const socket2: Socket = this.getSocketByUserId(match.player2.userId);

		if (socket1 === undefined || socket2 === undefined) {
			console.log("Error: socket undefined");
			this.server.to(match.matchId.toString()).emit('match canceled');
			this.socketsService.deleteMatch(match.matchId);
			return;
		}

		if (match.player1.score > match.player2.score && match.player1.score >= this.socketsService.gameConstants.winScore) {
			socket1.emit('match win', match.player1.username);
			socket2.emit('match lose', match.player2.username);
		} else if (match.player2.score > match.player1.score && match.player2.score >= this.socketsService.gameConstants.winScore) {
			socket1.emit('match lose', match.player1.username);
			socket2.emit('match win', match.player2.username);
		} else {
			this.server.to(match.matchId.toString()).emit('match canceled');
			this.socketsService.deleteMatch(match.matchId);
		}

		const winner = await prisma.user.findUnique({
			where: {
				id: match.player1.score > match.player2.score ? match.player1.userId : match.player2.userId
			}
		});

		const loser = await prisma.user.findUnique({
			where: {
				id: match.player1.score < match.player2.score ? match.player1.userId : match.player2.userId
			}
		});

		const matchDb = await prisma.match.create({
			data: {
				mode: "1v1",
				duration: Date.now() - match.started,
				winnerId: winner.id,
				loserId: loser.id,
				scoreWinner: match.player1.score > match.player2.score ? match.player1.score : match.player2.score,
				scoreLoser: match.player1.score < match.player2.score ? match.player1.score : match.player2.score,
			}
		});

		await prisma.match.update({
			where: {
				id: matchDb.id,
			},
			data: {
				winner: {
					connect: {
						id: winner.id,
					},
				},
				loser: {
					connect: {
						id: loser.id,
					},
				},
			}
		});

		return;
	}
}
