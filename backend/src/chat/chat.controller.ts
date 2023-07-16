import { Controller, Get, Body, Post, Param, Delete, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from 'express';


@ApiTags('Chat') // for swagger
@Controller('chat')
export class ChatController {
	constructor(
		private readonly usersService: UsersService, 
		private readonly chatService: ChatService) { }

	@Post('channel')
	createConv(@Body() body: CreateChannelDto) {
		return this.chatService.createChannel(body);
	}


}
