import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaClient, Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { UsersService } from 'src/users/users.service';
import { ChanMode, Message } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';

const hashingConfig = {
	parallelism: 1,
	memoryCost: 64000, // 64 mb
	timeCost: 3
};

const prisma = new PrismaClient();

@Injectable()
export class ChatService {
	constructor(private usersService: UsersService) { }

	async createChannel(body: CreateChannelDto) {
		const { roomName, ownerId, password, type } = body;
		
		let hashedPwd;
		if (type === ChanMode.PROTECTED && password !== undefined) {
			const { randomBytes } = await import('crypto');
			const buf = randomBytes(16);
			hashedPwd = await argon.hash(password, {
				...hashingConfig,
				salt: buf
			});
		}
		const newPassword = (password)? hashedPwd : null;
		try {
			const createdChannel = await prisma.channel.create({
				data: {
					roomName,
					type,
					password: newPassword,
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
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new BadRequestException('A channel with this name already exists');
				}
			}
		}
	}

	async getOneChannel(id: number) {
		return await prisma.channel.findUnique({
			where: { id },
			include: { 
				admin: true,
				joinedUsers: true,
				bannedUsers: true, 
				kickedUsers: true,
				mutedUsers: true,
				messages: true
			},
		});
	}

	async getOneChannelByName(roomName: string) {
		return await prisma.channel.findUnique({
			where: { roomName },
			include: { 
				admin: true,
				joinedUsers: true,
				bannedUsers: true, 
				kickedUsers: true,
				mutedUsers: true,
				messages: true
			},
		});
	}

	async getAllUserChannels(id: number) {
		const user = await this.usersService.findMe(id);
		return user.joinedChans;
	
	}

	async getPublicChannels(id: number) {
		const user = await this.usersService.findMe(id);
		const publicChans = await prisma.channel.findMany({
			where: { 
				joinedUsers: {
					some: {
						id: user.id,
					},
				},
				type: ChanMode.PUBLIC
			},
		});
		return publicChans;	
	}

	async getPrivateChannels(id: number) {
		const user = await this.usersService.findMe(id);
		const privateChans = await prisma.channel.findMany({
			where: { 
				joinedUsers: {
					some: {
						id: user.id,
					},
				},
				type: ChanMode.PRIVATE
			},
		});
		return privateChans;	
	}

	async getProtectedChannels(id: number) {
		const user = await this.usersService.findMe(id);
		const protectedChans = await prisma.channel.findMany({
			where: { 
				joinedUsers: {
					some: {
						id: user.id,
					},
				},
				type: ChanMode.PROTECTED
			},
		});
		return protectedChans;	
	}

	async getAllDirectMessages(id: number) {
		const user = await this.usersService.findMe(id);
		const directMessages = await prisma.channel.findMany({
			where: { 
				joinedUsers: {
					some: {
						id: user.id,
					},
				},
				type: ChanMode.DM
			},
		});
		return directMessages;	
	}

	async getDisplayableChans(userId: number) {
		return await prisma.channel.findMany({
			where: {
				OR: [
					{type: ChanMode.PROTECTED},
					{type: ChanMode.PUBLIC},
				],
				NOT: {
					joinedUsers: {
						some: { id: userId }
					}
				}
			}
		});
	}
	
	async deleteOneChannel(id: number) {
		// On delete le channel
		const result = await prisma.channel.delete({
			where: { id }
		});

		// On trouve tous les users qui l'avaient dans leur model
		const users = await prisma.user.findMany({
			where: {
			  OR: [
				{ ownerChans: { some: { id } } },
				{ adminsChans: { some: { id } } },
				{ bannedChans: { some: { id } } },
				{ joinedChans: { some: { id } } },
				{ kickedFromChans: { some: { id } } },
				{ mutedInChans: { some: { id } } },
			  ],
			},
		  });
		
		  // Pour chacun de ces users, on les déconnecte du chan deleted
		  for (const user of users) {
			await prisma.user.update({
			  where: { id: user.id },
			  data: {
				ownerChans: { disconnect: { id } },
				adminsChans: { disconnect: { id } },
				bannedChans: { disconnect: { id } },
				joinedChans: { disconnect: { id } },
				kickedFromChans: { disconnect: { id } },
				mutedInChans: { disconnect: { id } },
			  },
			});
		}

		return result;
	}

	/* For protected chans ONLY */
	async updateChannelPassword(id: number, createChannelDto: CreateChannelDto) {
		// Hash the channel password
		if (createChannelDto.password !== undefined) {
			const { randomBytes } = await import('crypto');
			const buf = randomBytes(16);
			const hash = await argon.hash(createChannelDto.password, {
				...hashingConfig,
				salt: buf
			});
			createChannelDto.password = hash;
		}
		
		return await prisma.channel.update({
			where: { id: id },
			data: {
				password: createChannelDto.password
			},
		});
	}

	async updateUserinChannel(channelId: number, body: UpdateChannelDto) {
		const {userId, groupToInsert, action } = body;
		// TODO: si chan protected, vérifier que password donné match!!!
		// TODO: si kick/ban/mute/admin, vérifier les droits!!! 
		return await prisma.channel.update({
			where: { id: channelId },
			data:  {
				[groupToInsert]: { [action]: { id: userId } },
			}
		});
	}


	// Messages
	// create a message and add it to the list
	async createMessage(body: CreateMessageDto): Promise<Message> {
		const { fromId, to, content, channelId } = body;
		
		return await prisma.message.create({
			data: {
				from: { connect: {id: fromId}},
				to,
				content,
				channel: { connect: { id: channelId } },
			},
		});
	}

	// get all messages
	async getAllMessagesForChannel(channelId: number): Promise<Message[]> {
		return await prisma.message.findMany({
			where: { channelId },
			orderBy: { date: 'asc' },
			include: { from: true }
		});
	}

	// delete all messages
	async deleteAllMessagesForChannel(channelId: number) {
		return await prisma.message.deleteMany({
			where: { channelId },
		});
	}
}

