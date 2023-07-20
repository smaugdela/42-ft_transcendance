import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { usernameMiddleware } from './middleware/username.middleware';
import { JwtService } from '@nestjs/jwt';
import { MatchClass } from './sockets.service';

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

	/* Message à envoyer aux listeners de l'event "receiveMessage" */
	@SubscribeMessage('Chat')
	async handleSendMessage(client: Socket, payload: string): Promise<void> {
		console.log(client.data.username, ':', payload);
		this.server.emit('receiveMessage', client.data.username + ": " + payload);

		// const room = "room test";
		// PB: on les ajoute dans la room que quand ils écrivent
		// if (client.data.username === "euh" || client.data.username === "Marinette") {
		// 	client.join(room); // une room étant: un chan ou un DM
		// 	console.log(client.data.username ," has joined the room!");	
		// }
		// this.server.to(room).emit('receiveMessage', client.data.username + ": " + payload);
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
			this.server.to(match.matchId.toString()).emit('match started');
			match.lastUpdate = Date.now();
			console.log("Match started");
		}
	}

	@SubscribeMessage('decline match')
	async handleDeclineMatch(client: Socket, payload: string): Promise<void> {
		void (payload);

		const userId = client.data.userId;

		console.log(client.data.username, "declined the match");

		const match = this.getMatchByUserId(userId);

		if (match === undefined) {
			return;
		}

		this.server.to(match.matchId.toString()).emit('match canceled');

		this.socketsService.deleteMatch(match.matchId);
	}

	/* ######################### */
	/* ######### GAME ########## */
	/* ######################### */

	@SubscribeMessage('game input')
	async handleGameInput(client: Socket, payload: string): Promise<void> {

		const userId = client.data.userId;

		const match = this.getMatchByUserId(userId);

		if (match === undefined) {
			return;
		}

		// If one of the players is not ready, do not actuate game state (Pause)
		if (match.player1.ready === false || match.player2.ready === false) {

			// If the match has been paused for more than 10 seconds (unresponsive player), cancel it.
			if (Date.now() - match.lastUpdate > 10000) {
				this.server.to(match.matchId.toString()).emit('match canceled');
				this.socketsService.deleteMatch(match.matchId);
				return;
			}

			this.server.to(match.matchId.toString()).emit('game state', match);
			return;
		}

		// If payload is not empty, actuate user state
		if (payload !== "") {
			switch (userId) {
				case match.player1.userId:
					// match.player1.input = payload;
					break;
				case match.player2.userId:
					// match.player2.input = payload;
					break;
				default:
					break;
			}
		}

		// Actuate ball state here

		// Send back match state to players
		match.lastUpdate = Date.now();
		this.server.to(match.matchId.toString()).emit('game state', match);
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

	// Wait for players to accept the match

	// private launchMatch(match: MatchClass) {

	// 	while (match.player1.ready === false || match.player2.ready === false) {

	// 		// Players have 20 seconds to accept the match
	// 		if (Date.now() - Date.parse(match.started.toString()) > 20000) {
	// 			this.server.to(match.matchId.toString()).emit('match canceled', match);
	// 			this.socketsService.deleteMatch(match.matchId);
	// 			console.log("Match canceled.");
	// 			console.log("Match: ", match);
	// 			return false;
	// 		}

	// 	}

	// 	this.server.to(match.matchId.toString()).emit('match started', match);
	// 	console.log("Match started.");
	// 	return true;
	// }

}
