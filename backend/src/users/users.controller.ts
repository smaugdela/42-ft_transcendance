import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import UserDto from './user.dto';

const prisma = new PrismaClient();

@Controller('/users')
export class UsersController {

  @Get()
  async getUsers() {
    return await prisma.user.findMany();
  }

  @Get(':userName')
	async getUserByName(@Param('userName') userName: string) {
	return await prisma.user.findUnique({
		where: {
			nickname: userName,
		},
	});
  }

  @Get('id/:userId')
  async getUserById(@Param('userId') userId: number) {
	return await prisma.user.findUnique({
		where: {
			id: Number(userId),
		},
	});
  }

  @Post()
  async createUser(@Body() newUser: UserDto) {
    console.log(newUser);
    await prisma.user.create({
      data: {
        avatar: newUser.avatar,
        nickname: newUser.nickname,
        mailAddress: newUser.mailAddress,
        coalition: newUser.coalition,
      },
    });
    console.log('New User Created!');
  }

//	@Put()
//	@Delete()

}
