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
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SocketsModule } from './sockets/sockets.module';
import { SocketsGateway } from './sockets/sockets.gateway';
import { SocketsService } from './sockets/sockets.service';

@Module({
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_GUARD, useClass: AuthGuard, }
	],
	imports: [UsersModule, AuthModule, JwtModule, ConfigModule.forRoot({ isGlobal: true }), SearchModule, CloudinaryModule, SocketsModule],
})

export class AppModule { }