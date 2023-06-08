import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
	controllers: [AuthController],
	providers: [AuthService, Reflector, WebsocketGateway],
	imports: [JwtModule.register({})],
})
export class AuthModule { }
