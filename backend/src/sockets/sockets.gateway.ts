import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
export class SocketsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
  constructor(private readonly socketsService: SocketsService) {}

	@WebSocketServer() server: Server;

	afterInit(server: Server) {
	console.log('WS Initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {
	console.log('Client connected:', client.id);
	}

	handleDisconnect(client: Socket) {
	console.log('Client disconnected:', client.id)
	}

	@SubscribeMessage('sendMessage')
	async handleSendMessage(client: Socket, payload: string): Promise<void> {
	console.log("message received from client, sending it to the others.")
	this.server.emit('receiveMessage', payload);
	}
}
