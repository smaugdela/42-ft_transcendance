import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
	providers: [SocketsGateway, SocketsService, JwtService]
})
export class SocketsModule { }
