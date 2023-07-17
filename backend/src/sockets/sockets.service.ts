import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Server, Socket } from 'socket.io';

const prisma = new PrismaClient();

class Player {
	userId: number;
}
class MatchClass {
	matchId: number;
	player1: Player;
	player2: Player;
	p1Ready: boolean;
	p2Ready: boolean;
	started: Date;
}

@Injectable()
export class SocketsService {

	private server: Server;

	setServer(newServer: Server) {
		this.server = newServer;
	}

	/* key = userId, value:string = socketId */
	public currentActiveUsers = new Map;

	public registerActiveSockets(userId: number, socketId: string) {
		this.currentActiveUsers.set(userId, socketId);
		console.log("Map: users connected: ", this.currentActiveUsers);
	}

	public deleteDisconnectedSockets(client: number) {
		this.currentActiveUsers.delete(client);
		console.log("Apres déco, nb de users en ligne: ", this.currentActiveUsers.size);
	}

	async activeUser(userId: number) {
		try {
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					isActive: true,
				},
			});
		} catch (error) {
			console.log(error);
			throw new HttpException("No such user", 400);
		}
	}

	async inactiveUser(userId: number) {
		try {
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					isActive: false,
				},
			});
		} catch (error) {
			console.log(error);
			throw new HttpException("No such user", 400);
		}
	}

	async launchMatch(match: MatchClass) {

		console.log("Server: ", this.server);

		const socket1: Socket = this.getSocketByUserId(match.player1.userId);
		const socket2: Socket = this.getSocketByUserId(match.player2.userId);

		if (socket1 === undefined || socket2 === undefined) {
			console.log("Error: socket undefined");
			return false;
		}

		socket1.join(match.matchId.toString());
		socket2.join(match.matchId.toString());
		this.server.to(match.matchId.toString()).emit('match ready', match);

		while (match.p1Ready === false || match.p2Ready === false) {

			// Players have 20 seconds to accept the match
			if (Date.now() - Date.parse(match.started.toString()) > 20000) {
				this.server.to(match.matchId.toString()).emit('match canceled', match);
				return false;
			}
		}

		this.server.to(match.matchId.toString()).emit('match started', match);
		return true;

	}

	private getSocketBySocketId(socketId: string): Socket | undefined {
		return this.server.sockets.sockets.get(socketId);
	}

	private getSocketByUserId(userId: number): Socket | undefined {
		const socketId = this.currentActiveUsers[userId];
		return this.getSocketBySocketId(socketId);
	}
}
