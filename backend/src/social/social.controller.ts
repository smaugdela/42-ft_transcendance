import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { SocialService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { Request } from 'express';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('/friend-request/:username')
  friendRequest(@Req() req: Request, @Param('username') username: string) {
    return this.socialService.friendRequest(req.userId, username);
  }

  @Post('/friend-request/:id/accept')
  acceptRequest(@Req() req: Request, @Param('id') id: string){
    return this.socialService.acceptRequest(req.userId, +id);
  }
  
  @Post('/block/:username')
  blockUser(@Param('username') username: string){
    return this.socialService.blockUser(username);
  }

  @Delete('/block/:username')
  removeFromBlock(@Param('id') id: string){
    return this.socialService.removeFromBlock(+id);
  }

  @Delete('/friend-request/:id/reject')
  rejectRequest(@Param('id') id: string){
    return this.socialService.rejectRequest(+id);
  }

  @Delete('friends/:username')
  removeFriend(@Param('id') id: string){
    return this.socialService.removeFriend(+id);
  }

}
