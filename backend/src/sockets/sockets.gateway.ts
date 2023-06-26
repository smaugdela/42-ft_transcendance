import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: process.env.FRONTEND_URL,
	}
})
export class SocketsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
	constructor(private readonly socketsService: SocketsService) { }

	@WebSocketServer() server: Server;

	afterInit(server: Server) {
		console.log('WS Initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {
		const cookies = client.handshake.headers.cookie;
		// try {
		// 	this.socketAuthService.authenticate(client);
		// 	console.log(`Client connected: ${client.id}`);
		// } catch (e) {
		// 	console.log(`Client ${client.id} tried to connect with invalid token`);
		// 	client.emit('unauthorized', 'Invalid Token');
		// 	client.disconnect();
		// 	console.log(`Client disconnected due to invalid token: ${client.id}`);
		// }
		console.log('Client connected:', client.id);
		console.log('cookies:', cookies);
	}

	handleDisconnect(client: Socket) {
		console.log('Client disconnected:', client.id)
	}

	@SubscribeMessage('sendMessage')
	async handleSendMessage(client: Socket, payload: string): Promise<void> {
		console.log(client.id, 'sent message:', payload)
		this.server.emit('receiveMessage', payload);
	}
}
