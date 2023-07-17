import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
	controllers: [ChatController],
	providers: [ChatService, JwtService, UsersService]
})
export class ChatModule { }
