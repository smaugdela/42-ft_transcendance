import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import MessagePayload from './payloads/message-payload';
import GamePayload from './payloads/game-payload';

@UseGuards(AuthGuard)
@WebSocketGateway()
export class WebsocketGateway {
	@WebSocketServer() server: Server;

	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: MessagePayload): void {
		if (payload.name === 'broadcast') {
			this.server.emit('message', payload); // Broadcasting the received message to all connected clients
		}
		// Add more conditions here to handle other types of messages
	}

	@SubscribeMessage('game')
	handleGame(client: Socket, payload: GamePayload): void {
		if (payload.type === 'input') {
			// Handle input inside game's logic.
		}
		// Add more conditions here to handle other types of packets
	}
}
