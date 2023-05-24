import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AppController],
  providers: [AppService,
	{ provide: APP_GUARD,
		useClass: AuthGuard, },
	],
  imports: [UsersModule, AuthModule, ConfigModule.forRoot({isGlobal: true})],
})
export class AppModule {}
