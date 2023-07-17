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
				where: { id: userId },
				data: {
					pendingList: {
						connect: { nickname: username }
					}
				}
			}
		);
	}

	async acceptRequest(userId: number, id: number) {
		await prisma.user.update(
			{
				where: { id: userId },
				data: {
					pendingList: {
						disconnect: { id: id }
					}
				}
			}
		)
		return await prisma.user.update(
			{
				where: { id: userId },
				data: {
					friendsList: {
						connect: { id: id }
					}
				}
			}
		);
	}

	async blockUser(userId: number, username: string) {
		await prisma.user.update(
			{
				where: { id: userId },
				data: {
					pendingList: {
						disconnect: { nickname: username }
					}
				}
			}
		)
		return await prisma.user.update(
			{
				where: { id: userId },
				data: {
					blockList: {
						connect: { nickname: username }
					}
				}
			}
		);
	}

	async removeFromBlock(userId: number, id: number) {
		await prisma.user.update(
			{
				where: { id: userId },
				data: {
					blockList: {
						disconnect: { id: id }
					}
				}
			}
		);
		return await prisma.user.update(
			{
				where: { id: userId },
				data: {
					friendsList: {
						connect: { id: id }
					}
				}
			}
		);
	}

	async rejectRequest(userId: number, id: number) {
		return await prisma.user.update(
			{
				where: { id: userId },
				data: {
					pendingList: {
						disconnect: { id: id }
					}
				}
			}
		);
	}

	async removeFriend(userId: number, id: number) {
		return await prisma.user.update(
			{
				where: { id: userId },
				data: {
					friendsList: {
						disconnect: { id: id }
					}
				}
			}
		);
	}
}
