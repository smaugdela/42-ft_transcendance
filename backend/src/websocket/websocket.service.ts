import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import MessagePayload from './payloads/message-payload';
import GamePayload from './payloads/game-payload';

@Injectable()
export class WebSocketService {
	private server: Server;

	setServer(server: Server): void {
		this.server = server;
		console.log("Server set.");
	}

	handleMessage(client: Socket, payload: MessagePayload): void {
		if (payload.name === 'broadcast') {
			this.server.emit('message', payload); // Broadcasting the received message to all connected clients
		}
		// Add more conditions here to handle other types of messages
	}

	handleGame(client: Socket, payload: GamePayload): void {
		if (payload.type === 'input') {
			// Handle input inside game's logic.
		}
		// Add more conditions here to handle other types of packets
	}
}
