import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './search/search.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule, AuthModule, ConfigModule.forRoot({isGlobal: true}), SearchModule],
})
export class AppModule {}
