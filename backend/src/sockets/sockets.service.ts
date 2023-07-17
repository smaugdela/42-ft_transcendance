import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SocketsService {

	/* key = userId, value:string = socketId */
	public currentActiveUsers = new Map;

	public registerActiveSockets(userId: number, socketId: string) {
		this.currentActiveUsers.set(userId, socketId);
		console.log("Map: users connected: ",  this.currentActiveUsers);
	}

	public deleteDisconnectedSockets(client: number) {
		this.currentActiveUsers.delete(client);
		console.log("Apres déco, nb de users en ligne: ", this.currentActiveUsers.size);
	}

	async activeUser(userId: number) {
		try {
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					isActive: true,
				},
			});
		} catch (error) {
			console.log(error);
			throw new HttpException("No such user", 400);
		}
	}

	async inactiveUser(userId: number) {
		try {
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					isActive: false,
				},
			});
		} catch (error) {
			console.log(error);
			throw new HttpException("No such user", 400);
		}
	}
}
