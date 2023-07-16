import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { PrismaClient } from '@prisma/client';
// import { Response } from 'express';
// import * as argon from 'argon2';
import { UsersService } from 'src/users/users.service';

// const hashingConfig = {
// 	parallelism: 1,
// 	memoryCost: 64000, // 64 mb
// 	timeCost: 3
// };
const prisma = new PrismaClient();

@Injectable()
export class ChatService {
	constructor(private usersService: UsersService) { }

	async createChannel(body: CreateChannelDto) {
		const { roomName, ownerId } = body;

		const createdChannel = await prisma.channel.create({
			data: {
				roomName,
				owner: { connect: {id: ownerId}},
				admin: { connect: {id: ownerId}},
			}
		});

		await prisma.user.update({
			where: { id: ownerId },
			data: {
				ownerChans: { connect: { id: createdChannel.id } },
    			joinedChans: { connect: { id: createdChannel.id } },
			},
		});
		return createdChannel;
	}
}

