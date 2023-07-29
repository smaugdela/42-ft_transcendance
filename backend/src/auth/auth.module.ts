import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { SocketsService } from 'src/sockets/sockets.service';

@Module({
	controllers: [AuthController],
	providers: [AuthService, Reflector, SocketsService],
	imports: [JwtModule.register({})],
})
export class AuthModule { }
