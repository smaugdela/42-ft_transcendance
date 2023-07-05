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

  async blockUser(userId: number, username: string) {
    await prisma.user.update (
      {
        where: {id: userId},
        disconnect: {pendingList: username}
      }
    )
    return  await prisma.user.update(
      {
        where: {id: userId},
        connect: {blockList: username}
      }
    );
  }

  async removeFromBlock(userId: number, id : number) {
    await prisma.user.update(
      {
        where: {id: userId},
        disconnect: {blockList: id}
      }
    );
    return  await prisma.user.update(
      {
        where: {id: userId},
        connect: {friendList: id}
      }
    );
  }

  async rejectRequest(userId: number, id : number) {
    return await prisma.user.update(
      {
        where: {id: userId},
        disconnect: {pendingList: id}
      }
    );
  }

  async removeFriend(userId: number, id :number) {
    return await prisma.user.update(
      {
        where: {id: userId},
        disconnect: {friendList: id}
      }
    );
  }
}
