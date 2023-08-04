import { Injectable } from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SocialService {
	async myFriends(userId: number)
	{
		const user   = await prisma.user.findUnique(
		{
			where : {id: userId},
			include: { friendsList: true },
		}
		)
		if (user) 
			return user.friendsList;
		  
		return null;
	}

	async blockedList(userId: number)
	{
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

	async pendingList(userId: number)
	{
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


	async friendRequest(userId: number, username: string) 
	{
		const friend = await prisma.user.findUnique(
		{
			where: { nickname: username },
			include: { pendingList: true },
		}
		);
		if (!friend) {throw new NotFoundException('Friend not found.');}
		const user = await prisma.user.update(
		{
			where: { id: friend.id },
			data: { pendingList: {connect: { id: userId },},},
		}
		);

		delete user.password;
		delete user.token42;

		return user;
	}

	async acceptRequest(userId: number, id: number) 
	{
		await prisma.user.update(
			{
				where: { id: userId },
				data: {pendingList: {disconnect: { id: id }}}
			}
		);
		await prisma.user.update(
			{
				where: { id: id },
				include: { friendsList : true },
				data: { friendsList: { connect: { id: userId }}}
			}
		);
		const user = await prisma.user.update(
			{
				where: { id: userId },
				include: { friendsList : true },
				data: { 
					friendsList: { connect: { id: id }}
				}
			}
		);

		delete user.password;
		delete user.token42;

		return user;
	}

	async blockUser(userId: number, username: string) 
	{
		// Vérifier si l'ami existe
		const friendToBlock = await prisma.user.findUnique(
		{where: { nickname: username },});
		
		if (!friendToBlock) {throw new Error(`User '${username}' not found`);}
		
		// Supprimer l'ami de la liste d'amis de l'utilisateur actuel
		await prisma.user.update(
		{
			where: { id: userId },
			data: {friendsList: {disconnect: {nickname: username}},},
		});

		// Supprimer l'ami de la pending liste
		await prisma.user.update(
			{
				where: { id: userId },
				data: {pendingList: {disconnect: {nickname: username}},},
			});

		// Supprimer l'ami bloqué de ses relations
		await prisma.user.update(
		{
			where: { nickname: username },
			data: {friendsList: {disconnect:{id: userId},},},
		});

		// Ajouter l'ami à la liste de blocage de l'utilisateur actuel
		const user = await prisma.user.update(
		{
			where: { id: userId },
			data: {blockList: {connect: {nickname: username,},},},
		});

		delete user.password;
		delete user.token42;

		return user;
	}


	async removeFromBlock(userId: number, id: number) 
	{
		const user = await prisma.user.update(
			{
				where: { id: userId },
				data: { blockList: {disconnect: { id: id }}}
			}
		);

		delete user.password;
		delete user.token42;

		return user;
	}

	async rejectRequest(userId: number, id: number) 
	{
		const user = await prisma.user.update(
		{
			where: { id: userId },
			data: {pendingList: {disconnect: { id: id }}}
		}
		);

		delete user.password;
		delete user.token42;

		return user;
	}

	async removeFriend(userId: number, id: number) 
	{
		await prisma.user.update(
		{
			where: { id: id },
			include: { friendsList : true },
			data: { friendsList: { disconnect: { id: userId }}}
		}
		);
		const user = await prisma.user.update(
		{
			where: { id: userId },
			data: {friendsList: {disconnect: { id: id }}},
		}
		);

		delete user.password;
		delete user.token42;

		return user;
	}
}
