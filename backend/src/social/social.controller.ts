import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { SocialService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Social') // for swagger
@Controller('social')
export class SocialController {

  constructor(private readonly socialService: SocialService) {}

  @Get('/friends')
  myFriends(@Req() req: Request){
    return this.socialService.myFriends(req.userId);
  }

  @Get('/blocked-list')
  blockedList(@Req() req: Request){
    return this.socialService.blockedList(req.userId);
  }

  @Get('/pending-list')
  pendingList(@Req() req: Request){
    return this.socialService.pendingList(req.userId);
  }

  @Post('/friend-request/:username')
  friendRequest(@Req() req: Request, @Param('username') username: string) {
    return this.socialService.friendRequest(req.userId, username);
  }

  @Post('/friend-request/:id/accept')
  acceptRequest(@Req() req: Request, @Param('id') id: string){
    return this.socialService.acceptRequest(req.userId, +id);
  }
  
  @Post('/block/:username')
  blockUser(@Req() req: Request, @Param('username') username: string){
    return this.socialService.blockUser(req.userId, username);
  }

  @Delete('/block/:id')
  removeFromBlock(@Req() req: Request, @Param('id') id: string){
    return this.socialService.removeFromBlock(req.userId, +id);
  }

  @Delete('/friend-request/:id/reject')
  rejectRequest(@Req() req: Request, @Param('id') id: string){
    return this.socialService.rejectRequest(req.userId, +id);
  }

  @Delete('friends/:id')
  removeFriend(@Req() req: Request, @Param('id') id: string){
    return this.socialService.removeFriend(req.userId, +id);
  }


}
