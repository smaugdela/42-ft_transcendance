import { Test, TestingModule } from '@nestjs/testing';
import { SocketsGateway } from './sockets.gateway';
import { SocketsService } from './sockets.service';

describe('SocketsGateway', () => {
  let gateway: SocketsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketsGateway, SocketsService],
    }).compile();

    gateway = module.get<SocketsGateway>(SocketsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
