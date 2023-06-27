import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';

@Module({
  providers: [SocketsGateway, SocketsService]
})
export class SocketsModule {}
