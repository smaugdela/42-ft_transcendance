import { Controller, Post, Req } from '@nestjs/common';
import { GamesService } from './games.service';
import { Request } from 'express';

@Controller('games')
export class GamesController {
	constructor(private readonly gamesService: GamesService) { }

	@Post()
	async matchmaking(@Req() req: Request) {
		return await this.gamesService.matchmaking(req.userId);
	}
}
