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
	constructor(private readonly socketsService: SocketsService, 
				private readonly jwtService: JwtService) { }

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
		console.log(client.data.username ,` has joined the room ${payload}!`);	
	}

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


}
