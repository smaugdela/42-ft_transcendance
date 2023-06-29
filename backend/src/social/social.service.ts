import { Injectable } from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SocialService {
  async friendRequest(userId: number, username: string) {
    return await prisma.user.update(
      {
        where: {id: userId},
        connect: {pendingList: username}
      }
    );
  }

  async acceptRequest(userId: number, id: number) {
    await prisma.user.update(
      {
        where: {id: userId},
        disconnect: {pendingList: id}
      }
    )
    return  await prisma.user.update(
      {
        where: {id: userId},
        connect: {friendList: id}
      }
    );
  }

  blockUser(username: string) {
    return 'This action adds a new social';
  }

  removeFromBlock(id : number) {
    return 'This action adds a new social';
  }

  rejectRequest(id : number) {
    return 'This action adds a new social';
  }

  removeFriend(id :number) {
    return 'This action adds a new social';
  }
}
