import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { WebSocketService } from './websocket.service';
import MessagePayload from './payloads/message-payload';
import GamePayload from './payloads/game-payload';

// @UseGuards(AuthGuard)
@WebSocketGateway()
export class WebsocketGateway {
	@WebSocketServer() server: Server;

	constructor(private webSocketService: WebSocketService) {
		this.webSocketService.setServer(this.server);
	}

	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: MessagePayload): void {
		this.webSocketService.handleMessage(client, payload);
	}

	@SubscribeMessage('game')
	handleGame(client: Socket, payload: GamePayload): void {
		this.webSocketService.handleGame(client, payload);
	}
}
