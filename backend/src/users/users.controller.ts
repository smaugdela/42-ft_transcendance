import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import UserDto from './user.dto';

const prisma = new PrismaClient();

@Controller('users')
export class UsersController {
	@Get()
	async getUsers() {
		return await prisma.user.findMany();
	}

	@Post()
	async createUser(@Body() newUser: UserDto) {
		console.log(newUser);
		await prisma.user.create({
			data: {
				avatar: 		newUser.avatar,
				nickname:		newUser.nickname,
				mailAddress:	newUser.mailAddress,
				coalition:		newUser.coalition,
			},
		}
		);
		console.log("New User Created!");
	}
}
