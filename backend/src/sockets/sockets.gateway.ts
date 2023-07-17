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

		/* TODO: regarder dans quels chans la personne est déjà et la rajouter */

	}

	/* Indique dans le User scheme qu'il est inactif et le déconnecte */
	handleDisconnect(client: Socket) {
		this.socketsService.inactiveUser(client.data.userId);
		this.socketsService.deleteDisconnectedSockets(client.data.userId);

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
	/* ######### GAMES ######### */
	/* ######################### */

	@SubscribeMessage('Join Queue')
	async handleJoinQueue(client: Socket, payload: string): Promise<void> {
		void (payload);

		const userId = client.data.userId;
		const username = client.data.username;


		// Add user to queue
		this.socketsService.addToQueue(userId, username);
		console.log(username, " joined the queue");

		// Check if there is a match to launch
		this.socketsService.cleanupQueue();
		this.socketsService.cleanupMatches();
		let match;
		if (this.socketsService.queue.length >= 2) {
			match = this.socketsService.addMatch();
			this.launchMatch(match);
		}
	}

	@SubscribeMessage('Accept Match')
	async handleAcceptMatch(client: Socket, payload: string): Promise<void> {
		void (payload);

		const userId = client.data.userId;

		const match = this.getMatchByUserId(userId);
		if (match === undefined) {
			console.log("Error: match undefined");
			return;
		} else if (match.player1.userId === userId) {
			match.p1Ready = true;
		} else if (match.player2.userId === userId) {
			match.p2Ready = true;
		}
	}

	/* ######################### */
	/* ######### MISC ########## */
	/* ######################### */

	private getSocketBySocketId(socketId: string): Socket | undefined {
		return this.server.sockets.sockets.get(socketId);
	}

	private getSocketByUserId(userId: number): Socket | undefined {
		const socketId = this.socketsService.currentActiveUsers[userId];
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

	private launchMatch(match: MatchClass) {

		const socket1: Socket = this.getSocketBySocketId(match.player1.socketId);
		const socket2: Socket = this.getSocketBySocketId(match.player2.socketId);

		if (socket1 === undefined || socket2 === undefined) {
			console.log("Error: socket undefined");
			return false;
		}

		socket1.join(match.matchId.toString());
		socket2.join(match.matchId.toString());
		this.server.to(match.matchId.toString()).emit('match ready', match);

		console.log("Match ready, waiting for players to accept...");

		while (match.p1Ready === false || match.p2Ready === false) {

			// Players have 20 seconds to accept the match
			if (Date.now() - Date.parse(match.started.toString()) > 20000) {
				this.server.to(match.matchId.toString()).emit('match canceled', match);
				this.socketsService.deleteMatch(match.matchId);
				console.log("Match canceled.");
				console.log("Match: ", match);
				return false;
			}

		}

		this.server.to(match.matchId.toString()).emit('match started', match);
		console.log("Match started.");
		return true;
	}

}
