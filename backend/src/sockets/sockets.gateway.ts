import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { usernameMiddleware } from './middleware/username.middleware';
import { JwtService } from '@nestjs/jwt';

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
		this.socketsService.setServer(server);
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
		console.log(client.data.username ,` has joined the room ${payload}!`);	
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

}
