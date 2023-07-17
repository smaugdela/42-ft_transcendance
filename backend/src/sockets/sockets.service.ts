import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Player {
	userId: number;
	socketId: string;
	username: string;
	score: number;
}
export class MatchClass {
	matchId: number;
	player1: Player;
	player2: Player;
	p1Ready: boolean;
	p2Ready: boolean;
	started: Date;
}

@Injectable()
export class SocketsService {

	/* key = userId, value:string = socketId */
	public currentActiveUsers = new Map;

	public queue: Player[] = [];

	public matchId = 0;

	public matches: MatchClass[] = [];

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

	addToQueue(userId: number, username: string) {
		const player = new Player;
		player.userId = userId;
		player.socketId = this.currentActiveUsers.get(userId);
		player.username = username;
		player.score = 0;
		this.queue.push(player);
	}

	cleanupQueue() {
		console.log("Queue Cleanup.")
		for (let i = 0; i < this.queue.length;) {
			const userId = this.queue[i].userId;
			if (this.currentActiveUsers.get(userId) === undefined) {
				this.queue.splice(i, 1);
			}
			else {
				i++;
			}
		}
		console.log("Queue Cleanup Done.")
	}

	addMatch() {
		const match = new MatchClass;
		match.matchId = this.matchId++;
		match.player1 = this.queue.shift();
		match.player2 = this.queue.shift();
		match.p1Ready = false;
		match.p2Ready = false;
		match.started = new Date();
		this.matches.push(match);
		return match;
	}

	deleteMatch(matchId: number) {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.matches[i].matchId === matchId) {
				this.queue.splice(i, 1);
				return;
			}
		}
	}

	cleanupMatches() {
		console.log("Matches Cleanup...")
		for (let i = 0; i < this.matches.length;) {
			const match = this.matches[i];
			if (this.currentActiveUsers.get(match.player1.userId) === undefined || this.currentActiveUsers[match.player2.userId] === undefined) {
				this.matches.splice(i, 1);
			}
			else {
				i++;
			}
		}
		console.log("Matches Cleanup Done.")
	}

}
