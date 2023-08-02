import { Controller, Body, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags } from "@nestjs/swagger";
import { Prisma } from '@prisma/client';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) { }

	/* ###################### */
	/* ###    CHANNELS    ### */
	/* ###################### */

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
	
	@Get('channels/more/:id')
	getDisplayableConvs(@Param('id') id: string) {
		return this.chatService.getDisplayableChans(+id);
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
	
	// Update chan's roomName or Type
	@Patch('channel/:id/update')
	updateProperty(@Param('id') id: string, @Body() body: Prisma.ChannelUpdateInput ) {
		return this.chatService.updateChannelProperties(+id, body);
	}

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

	/* ### DELETE ### */	
	@Delete('channel/:id')
	removeMe(@Param('id') id: string) {
		return this.chatService.deleteOneChannel(+id);
	}

	@Delete('channel/leave/:id')
	deleteUserinChannel(@Param('id') id: string, @Body() body: UpdateChannelDto) {
		return this.chatService.deleteUserinChannel(+id, body);
	}

	/* ###################### */
	/* ###    MESSAGES    ### */
	/* ###################### */

	@Post('message')
	createMessage(@Body() body: CreateMessageDto) {
		return this.chatService.createMessage(body);
	}

	@Get('messages/:id')
	getAllMessages(@Param('id') id: string) {
		return this.chatService.getAllMessagesForChannel(+id);
	}

	@Delete('messages/:id')
	deleteAllMessages(@Param('id') id: string) {
		return this.chatService.deleteAllMessagesForChannel(+id);
	}
}
