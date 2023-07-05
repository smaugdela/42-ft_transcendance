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
  blockUser(@Req() req: Request, @Param('username') username: string){
    return this.socialService.blockUser(req.userId, username);
  }

  @Delete('/block/:username')
  removeFromBlock(@Req() req: Request, @Param('id') id: string){
    return this.socialService.removeFromBlock(req.userId, +id);
  }

  @Delete('/friend-request/:id/reject')
  rejectRequest(@Req() req: Request, @Param('id') id: string){
    return this.socialService.rejectRequest(req.userId, +id);
  }

  @Delete('friends/:username')
  removeFriend(@Req() req: Request, @Param('id') id: string){
    return this.socialService.removeFriend(req.userId, +id);
  }

}
