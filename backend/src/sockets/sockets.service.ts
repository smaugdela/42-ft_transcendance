import { HttpException, Injectable } from '@nestjs/common';
import { Activity, PrismaClient } from '@prisma/client';
import { Socket } from 'socket.io';

const prisma = new PrismaClient();

export class Player {
	userId: number;
	mode: string;
	username: string;
	score: number;
	ready: boolean;
	lastUpdate: number;
}

export class MatchClass {
	matchId: number;
	started: number;
	mode: string;	// Classic ou Custom

	player1: Player;
	player2: Player;

	p1posY: number;
	p2posY: number;

	ballX: number;
	ballY: number;
	ballSpeedX: number;
	ballSpeedY: number;

	powerUp: boolean;
	powerUpOn: boolean;
	powerUpX: number;
	powerUpY: number;
	powerUpDate: number;

	lastUpdate: number;
}

@Injectable()
export class SocketsService {

	public gameConstants = {
		width: 800, // in pixels
		height: 600, // in pixels
		paddleLength: 100, // in pixels
		paddleWidth: 10, // in pixels
		ballRadius: 5, // in pixels
		maxBallSpeed: 1000, // in pixels per second
		winScore: 10, // in points
		powerUpRadius: 20, // in pixel
	};

	/* key = userId, value:string = socketId */
	public currentActiveUsers = new Map;

	public queue: Player[] = [];

	public matchId = 0;

	public matches: MatchClass[] = [];

	public registerActiveSockets(userId: number, socketId: string) {
		this.currentActiveUsers.set(userId, socketId);
	}

	public deleteDisconnectedSockets(client: number) {
		this.currentActiveUsers.delete(client);
	}

	async activeUser(userId: number) {
		try {
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					isActive: Activity.ONLINE,
				},
			});
		} catch (error) {
			throw new HttpException("No such user", 400);
		}
	}

	async playingUser(userId: number) {
		try {
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					isActive: Activity.INGAME,
				},
			});
		} catch (error) {
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
					isActive: Activity.OFFLINE,
				},
			});
		} catch (error) {
			throw new HttpException("No such user", 400);
		}
	}

	createPlayer(userId: number, username: string, mode: string) {
		const player = new Player;
		player.userId = userId;
		player.mode = mode;
		player.username = username;
		player.score = 0;
		return player;
	}

	addToQueue(userId: number, username: string, mode: string): number {

		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].userId === userId) {
				return i;
			}
		}

		const player = this.createPlayer(userId, username, mode);
		this.queue.push(player);

		return this.queue.length - 1;
	}

	addMatch(mode = "Classic", player1: Player = undefined, player2: Player = undefined) {

		const match = new MatchClass;
		match.matchId = this.matchId++;
		match.mode = mode;

		if (player1 === undefined) {
			match.player1 = this.queue.shift();
		} else {
			match.player1 = player1;
		}
		if (player2 === undefined) {
			match.player2 = this.queue.shift();
		} else {
			match.player2 = player2;
		}

		match.player1.ready = false;
		match.player2.ready = false;
		match.p1posY = (this.gameConstants.height / 2) - (this.gameConstants.paddleLength / 2);
		match.p2posY = (this.gameConstants.height / 2) - (this.gameConstants.paddleLength / 2);
		match.ballX = this.gameConstants.width / 2;
		match.ballY = this.gameConstants.height / 2;
		match.powerUpOn = false;
		match.powerUpDate = 0;
		// Power up config
		if (mode === "Classic")
			match.powerUp = false;
		else
			match.powerUp = true;
		match.powerUpX = Math.random() * (this.gameConstants.width / 2) + (this.gameConstants.width / 4);
		match.powerUpY = Math.random() * this.gameConstants.height;

		// horizontal ball speed is non null
		match.ballSpeedX = 90;
		// Random vertical ball speed between 10 and 100
		match.ballSpeedY = Math.random() * 90 + 10;
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
		for (let i = 0; i < this.matches.length; i++) {
			if (this.matches[i].matchId === matchId) {
				this.matches.splice(i, 1);
				return;
			}
		}
	}

	cleanupMatches() {
		for (let i = 0; i < this.matches.length;) {
			const match = this.matches[i];
			if ((match.player1.ready === false || match.player2.ready === false) && (Date.now() - match.started > 10000)) {
				this.deleteMatch(match.matchId);
			} else if ((Date.now() - match.player1.lastUpdate > 3000) || (Date.now() - match.player2.lastUpdate > 3000)) {
				this.deleteMatch(match.matchId);
			} else {
				i++;
			}
		}
	}

	// notifyFriendRequest(userId: number)
	// {
	// 	const socket = this.currentActiveUsers.get(userId);
	// 	if (!socket || socket === undefined)
	// 		return;
	// 	socket.emit("new friend request");
	// }

}
