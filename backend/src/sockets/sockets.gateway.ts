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

	/* ######################### */
	/* ######### CHAT ########## */
	/* ######################### */

	/* Message à envoyer aux listeners de l'event "receiveMessage" */
	@SubscribeMessage('sendMessage')
	async handleSendMessage(client: Socket, payload: string): Promise<void> {
		console.log(client.data.username, ':', payload);
		this.server.emit('receiveMessage', client.data.username + ": " + payload);



		/* Private message */



	}

	/* ######################### */
	/* ######### GAMES ######### */
	/* ######################### */

}
