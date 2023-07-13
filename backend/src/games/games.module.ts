import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { SocketsService } from 'src/sockets/sockets.service';

@Module({
	controllers: [GamesController],
	providers: [GamesService, SocketsService]
})
export class GamesModule { }
