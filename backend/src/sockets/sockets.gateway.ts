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
	constructor(private readonly socketsService: SocketsService, private readonly jwtService: JwtService) { }

	@WebSocketServer() server: Server;


	afterInit(server: Server) {
		server.use(usernameMiddleware(this.jwtService));
		console.log('WS Initialized');
	}

	async handleConnection(client: Socket, ...args: any[]) {
		void (args);
		await this.socketsService.activeUser(client.data.userId);
		console.log('Client connected:', client.data.username);
	}

	handleDisconnect(client: Socket) {
		this.socketsService.inactiveUser(client.data.userId);
		console.log('Client disconnected:', client.data.username);
		client.disconnect(true);
	}

	@SubscribeMessage('sendMessage')
	async handleSendMessage(client: Socket, payload: string): Promise<void> {
		console.log(client.data.username, ':', payload);
		this.server.emit('receiveMessage', client.data.username + ": " + payload);
	}
}
