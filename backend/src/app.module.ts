import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { SearchModule } from './search/search.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_GUARD, useClass: AuthGuard, },
		WebsocketGateway,
		ChatGateway
	],
	imports: [UsersModule, AuthModule, JwtModule, ConfigModule.forRoot({ isGlobal: true }), SearchModule],
})

export class AppModule {}