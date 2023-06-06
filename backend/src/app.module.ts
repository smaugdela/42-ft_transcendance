import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_GUARD, useClass: AuthGuard, },
		AuthService,
	],
	imports: [UsersModule, AuthModule, JwtModule, WebSocketModule, ConfigModule.forRoot({ isGlobal: true })],
})

export class AppModule { }