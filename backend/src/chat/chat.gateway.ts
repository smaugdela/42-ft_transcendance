import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway(3001, { namespace: 'chat'}) // url is : ws://localhost:3001/chat
export class ChatGateway {
	
	@WebSocketServer()
	server;

	// extract out the message from the data payload
	@SubscribeMessage('message')
	handleMessage(@MessageBody() message: string): void {
		console.log(message);
		
		// broadcast an incoming message to all listeners of this gateway; with namespace chat
		this.server.emit('message', message); // 'message' is the name of the event we're emitting
	}
}