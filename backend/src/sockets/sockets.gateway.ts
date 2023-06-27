import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';

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
	}

	async handleConnection(client: Socket, ...args: any[]) {

		const cookies = client.handshake.headers.cookie;
		const isAuthorized = await this.socketsService.authSocket(cookies);
		if (isAuthorized) {
			console.log('Client connected:', client.id);
		} else {
			console.log('Client not authorized:', client.id);
			client.disconnect();
			throw new UnauthorizedException("Acess Token is either inexistent, invalid or expired.");
		}
		// console.log('cookies:', cookies);
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
