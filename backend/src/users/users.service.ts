import { ConflictException, HttpException, Injectable, Res } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient, Prisma } from '@prisma/client';
import { Response } from 'express';
import * as argon from 'argon2';
import { MailService } from 'src/mail/mail.service';

// add but pas sur 

import { NotFoundException } from '@nestjs/common';
// import { PrismaService } from './prisma.service';
import { User, Achievement } from '@prisma/client';

const hashingConfig = {
	parallelism: 1,
	memoryCost: 64000, // 64 mb
	timeCost: 3
};
const prisma = new PrismaClient();

@Injectable()
export class UsersService {

	constructor(private mailService: MailService) { }

	async checkIfLoggedIn(userId: number | undefined): Promise<boolean> {
		// If id is undefined, then the user is not logged in.
		if (userId === undefined) {
			return false;
		} else {
			const ret: boolean = await prisma.user.findUnique({
				where: { id: userId }
			})
				.then(user => {
					if (user) {
						// console.log(user);
						return true;
					}
					return false;
				}).catch(() => { return false });
			return ret;
		}
	}

	async findAll() {
		return await prisma.user.findMany();
	}

	async findMe(id: number) {
		return await prisma.user.findUnique({
			where: { id },
			include: {
				achievements: true,
				matchAsP1: true,
				matchAsP2: true, 
				ownerChans:true,
				joinedChans: {
					include: {
						admin: true,
						owner: true,
						joinedUsers: true,
						bannedUsers: true, 
						kickedUsers: true,
						mutedUsers: true,
						messages: true
					}
				},
				friendsList: true,
				blockList: true,
				pendingList :true,
			},
		});
	}

	async updateMe(id: number, updateUserDto: UpdateUserDto) {

		// If the user wants to change his password, we hash it.
		if (updateUserDto.password !== undefined) {
			// generate password hash
			const { randomBytes } = await import('crypto');
			const buf = randomBytes(16);
			const hash = await argon.hash(updateUserDto.password, {
				...hashingConfig,
				salt: buf
			});
			updateUserDto.password = hash;
		}

		try {
			const user = await prisma.user.findUnique({
				where: { id },
			});
			// If the user wants to change his email, we disable 2FA and resend a confirmation email at the new adress.
			if (updateUserDto.email !== undefined && updateUserDto.email !== user.email) {

				updateUserDto.enabled2FA = false;
				updateUserDto.confirmedMail = false;

				// Send confirmation email
				this.mailService.sendUserConfirmation(id);
			}
			// If the user wants to enable 2FA, we check if his email is confirmed first.
			if (updateUserDto.enabled2FA !== undefined && updateUserDto.enabled2FA === true && user.confirmedMail === false)
				throw new HttpException('Email not confirmed', 400);
			await prisma.user.update({
				where: { id },
				data: updateUserDto,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { // https://www.prisma.io/docs/reference/api-reference/error-reference
				throw new ConflictException('Nickname already exists');
			}
			throw new HttpException('Bad email', 400);
		}
	}

	async updateAvatar(id: number, avatarUrl: string) {
		return await prisma.user.update({
			where: { id: id },
			data: {
				avatar: avatarUrl
			},
		});
	}

	async removeMe(id: number, @Res({ passthrough: true }) res: Response) {
		res.clearCookie('jwt');
		return await prisma.user.delete({
			where: { id: id }
		});
	}

	async findOne(username: string) {
//		prisma.user.update(achievement), // pas comme ca mais faut le faire
			return await prisma.user.findUnique({
			where: { nickname: username },
			include: {
				achievements: true,
				matchAsP1: true,
				matchAsP2: true, 
				ownerChans:true,
				joinedChans: {
					include: {
						admin: true,
						owner: true,
						joinedUsers: true,
						bannedUsers: true, 
						kickedUsers: true,
						mutedUsers: true,
						messages: true
					}
				},
				friendsList: true,
				blockList: true,
				pendingList :true,
			},
		});
	
	}

	// async isAchievementCompleted(userId: number, achievement: Achievement): Promise<boolean> {
	// 	// Return a boolean value indicating if the achievement is completed or not.
	// 	if (achievement.title === 'Baby steps') {
	// 	const match = await this.prisma.match.findFirst({
	// 		where: { OR: [{ matchAsP1: { userId } }, { matchAsP2: { userId } }] },
	// 	})
	// 	if (!match)
	// 	  return false; 
	// 	}
	// 	 else if (achievement.title === 'Veteran') {
	// 	  // Example specific check for the 'Veteran' achievement
	// 	  return false; // Replace this with your actual implementation
	// 	} else {
	// 	  // Handle other achievements
	// 	  return false; // Replace this with your actual implementation
	// 	}
	// }

	async findOneById(id: number) {
		return await prisma.user.findUnique({
			where: { id: id },
			include: { achievements: true },
		});
	}

	async getHistoryMatch(id: number) {
		console.log("id", id);

		const user = await prisma.user.findUnique({
			where: { id: id },
			include: {
				matchAsP1: { // quand user a gagné
					include: {
						loser: true, // permet de récup les data de l'opponent
					},
				},
				matchAsP2: { // quand user a perdu
					include: {
						winner: true, // permet de récup les data de l'opponent
					},
				},
			},
		});

		const winnerMatches = user.matchAsP1;
		const loserMatches = user.matchAsP2;
		const allMatches = [...winnerMatches, ...loserMatches];

		const sortedMatches = allMatches.sort((a, b) => {
			return a.date.getTime() - b.date.getTime();
		});

		console.log('User history matches are: ', sortedMatches);

		return sortedMatches;
	}
}

