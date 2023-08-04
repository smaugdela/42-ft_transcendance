import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { SocketsService } from 'src/sockets/sockets.service';

@Module({
  controllers: [SocialController],
  providers: [SocialService, SocketsService]
})
export class SocialModule {}
