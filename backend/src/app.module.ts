import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { SearchModule } from './search/search.module';
import { CloudinaryModule } from './uploadimg/cloudinary.module';
import { SocketsModule } from './sockets/sockets.module';
import { SocketsGateway } from './sockets/sockets.gateway';
import { SocketsService } from './sockets/sockets.service';
import { SocialModule } from './social/social.module';
import { SocialModule } from './social/social.module';

@Module({
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_GUARD, useClass: AuthGuard, },
		SocketsGateway,
		SocketsService
	],
	imports: [UsersModule, AuthModule, JwtModule, ConfigModule.forRoot({ isGlobal: true }), SearchModule, CloudinaryModule, SocketsModule, SocialModule],
})

export class AppModule {}