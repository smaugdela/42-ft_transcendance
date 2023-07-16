import { Controller, Body, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ApiTags } from "@nestjs/swagger";
import { UpdateChannelDto } from './dto/update-channel.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) { }

	/* ### CREATE ### */	
	@Post('channel')
	createConv(@Body() body: CreateChannelDto) {
		return this.chatService.createChannel(body);
	}
	
	/* ### READ ### */	
	@Get('channel/:id')
	getOneConv(@Param('id') id: string) {
		return this.chatService.getOneChannel(+id);
	}

	@Get('channel/find/:roomName')
	getOneConvByName(@Param('roomName') roomName: string) {
		return this.chatService.getOneChannelByName(roomName);
	}
		
	@Get('channels/all/:id')
	getAllConvs(@Param('id') id: string) {
		return this.chatService.getAllUserChannels(+id);
	}

	@Get('channels/public/:id')
	getPublicChans(@Param('id') id: string) {
		return this.chatService.getPublicChannels(+id);
	}

	@Get('channels/private/:id')
	getPrivateChans(@Param('id') id: string) {
		return this.chatService.getPrivateChannels(+id);
	}

	@Get('channels/protected/:id')
	getProtectedChans(@Param('id') id: string) {
		return this.chatService.getProtectedChannels(+id);
	}

	@Get('channels/directmsg/:id')
	getDirectMessages(@Param('id') id: string) {
		return this.chatService.getAllDirectMessages(+id);
	}

	/* ### UPDATE ### */	
	
	// Update protected chan's password
	@Patch('channel/:id')
	updatePassword(@Param('id') id: string, @Body() body: CreateChannelDto) {
		return this.chatService.updateChannelPassword(+id, body);
	}

	// Add ou erase a user to/(of) a convo, to admin/kick/ban/mute groups
	@Post('channel/:id')
	addSomeoneToConv(@Param('id') id: string, @Body() body: UpdateChannelDto) {
		return this.chatService.updateUserinChannel(+id, body);
	}

	// ou message à ajouter

	/* ### DELETE ### */	
	@Delete('channel/:id')
	removeMe(@Param('id') id: string) {
		return this.chatService.deleteOneChannel(+id);
	}
}
