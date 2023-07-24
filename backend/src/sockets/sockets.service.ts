import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Player {
	userId: number;
	username: string;
	score: number;
	ready: boolean;
}

export class MatchClass {
	matchId: number;
	started: number;

	player1: Player;
	player2: Player;

	p1posY: number;
	p2posY: number;

	ballX: number;
	ballY: number;
	ballSpeedX: number;
	ballSpeedY: number;

	lastUpdate: number;
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
		// console.log("Apres déco, nb de users en ligne: ", this.currentActiveUsers.size);
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

		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].userId === userId) {
				console.log("User already in queue.");
				return;
			}
		}

		const player = new Player;
		player.userId = userId;
		player.username = username;
		player.score = 0;
		this.queue.push(player);

		console.log(username, " joined the queue");

	}

	addMatch() {

		const match = new MatchClass;
		match.matchId = this.matchId++;
		match.player1 = this.queue.shift();
		match.player2 = this.queue.shift();
		match.player1.ready = false;
		match.player2.ready = false;
		match.p1posY = 0;
		match.p2posY = 0;
		match.ballX = 0;
		match.ballY = 0;

		// Random ball speed between 0.1 and 0.3
		match.ballSpeedX = Math.random() * 0.2 + 0.1;
		match.ballSpeedY = Math.random() * 0.2 + 0.1;
		// ballSpeedX should not be null
		if (match.ballSpeedX < 0.1) {
			match.ballSpeedX = 0.1;
		}
		// Randomize ball direction
		if (Math.random() > 0.5) {
			match.ballSpeedX *= -1;
		}
		if (Math.random() > 0.5) {
			match.ballSpeedY *= -1;
		}

		match.started = Date.now();
		this.matches.push(match);
		return match;
	}

	deleteMatch(matchId: number) {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.matches[i].matchId === matchId) {
				this.queue.splice(i, 1);
				console.log("Match #", matchId, " deleted.");
				return;
			}
		}
	}

	endMatch(matchId: number) {
		// TODO: update score in db, and graciously end the match
		void (matchId);
	}

	cleanupMatches() {
		console.log("Matches Cleanup.")
		for (let i = 0; i < this.matches.length;) {
			const match = this.matches[i];
			if ((match.player1.ready === false || match.player2.ready === false) && (Date.now() - match.started > 10000)) {
				this.deleteMatch(match.matchId);
			} else {
				i++;
			}
		}
	}

}
