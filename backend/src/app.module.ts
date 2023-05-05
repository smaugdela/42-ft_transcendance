import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './auth/strategies/google.strategy';


@Module({
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
  imports: [UsersModule, AuthModule, ConfigModule.forRoot({isGlobal: true})],
})
export class AppModule {}
