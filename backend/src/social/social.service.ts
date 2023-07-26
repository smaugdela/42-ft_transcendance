import { Injectable } from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
// import { PrismaClient } from '@prisma/client';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SocialService {
	async myFriends(userId: number) {
		const user   = await prisma.user.findUnique(
			{
				where : {id: userId},
				include: { friendsList: true },
			}
		)
		if (user) {
			return user.friendsList;
		  }
		  
		  return null;
	}

	async blockedList(userId: number){
		const user = await prisma.user.findUnique(
			{
				where : {id: userId},
				include: { blockList: true},
			}
		)
		if (user)
			return user.blockList;
		return null;
	}

	async pendingList(userId: number){
		const user = await prisma.user.findUnique(
			{
				where : {id: userId},
				include: { pendingList: true},
			}
		)
		if (user)
			return user.pendingList;
		return null;
	}


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
		  // Vérifier si l'ami existe
		  const friendToBlock = await prisma.user.findUnique({
			where: { nickname: username },
		  });
		
		  if (!friendToBlock) {
			throw new Error(`User '${username}' not found`);
		  }
		
		  // Supprimer l'ami de la liste d'amis de l'utilisateur actuel
		  await prisma.user.update({
			where: { id: userId },
			data: {friendsList: {disconnect: {nickname: username}},},
		  });

		  // Supprimer l'ami bloqué de ses relations
			await prisma.user.update({
				where: { nickname: username },
				data: {friendsList: {disconnect:{nickname: username},},},
			});
		
		  // Ajouter l'ami à la liste de blocage de l'utilisateur actuel
		  return prisma.user.update({
			where: { id: userId },
			data: {
			  blockList: {
				connect: {
				  nickname: username,
				},
			  },
			},
		  });
		}


	async removeFromBlock(userId: number, id: number) {
		return await prisma.user.update(
			{
				where: { id: userId },
				data: { blockList: {disconnect: { id: id }}}
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
				data: {friendsList: {disconnect: { id: id }}},
			}
		);

	}
}
