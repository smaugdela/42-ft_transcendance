import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class Player {
	userId: number;
	score: number;
	joined: Date;
}

class Match {
	matchId: number;
	player1: Player;
	player2: Player;
	p1Score: number;
	p2Score: number;
	started: Date;
}

@Injectable()
export class GamesService {

	queue: Player[] = [];
	matches: Match[] = [];
	static matchId = 0;

	async matchmaking(userId: number) {


		try {
			const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
			const player = new Player();
			player.userId = userId;
			player.score = user.score;
			player.joined = new Date();
			this.queue.push(player);
		} catch (e) {
			throw new HttpException('Bad User', 406);
		}

		// Check if there are enough players
		if (this.queue.length < 2) {
			return 'Waiting for players';
		}

		// Sort queue by score
		this.queue.sort((a, b) => a.score - b.score);

		while (this.queue.length > 1) {

			// Create match
			const match = new Match();
			match.matchId = GamesService.matchId++;
			match.player1 = this.queue[0];
			match.player2 = this.queue[1];
			match.p1Score = 0;
			match.p2Score = 0;
			match.started = new Date();
			this.matches.push(match);

			// Remove players from queue
			this.queue.splice(0, 2);
		}

		return 'This action makes the user join the matchmaking queue';
	}
}
