import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}
})
export class SocketsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
	constructor(private readonly socketsService: SocketsService) { }

	@WebSocketServer() server: Server;

	afterInit(server: Server) {
		console.log('WS Initialized');
		void (server);
	}

	async handleConnection(client: Socket, ...args: any[]) {

		console.log("args:", args);

		// We protect the socket connection
		const cookie: string = client.handshake.headers.cookie;
		if (await this.socketsService.authSocket(cookie) === false) {
			console.log("Socket Error: Invalid or inexistent JWT.")
			client.disconnect(true);
		}
		else
			console.log('Client connected:', client.id);
	}

	handleDisconnect(client: Socket) {
		console.log('Client disconnected:', client.id)
		client.disconnect();
	}

	@SubscribeMessage('sendMessage')
	async handleSendMessage(client: Socket, payload: string): Promise<void> {
		console.log(client.id, 'sent message:', payload)
		this.server.emit('receiveMessage', payload);
	}
}
