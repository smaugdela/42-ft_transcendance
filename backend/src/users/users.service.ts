import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {

	checkIfLoggedIn(user: string | undefined): boolean {
		// If id is undefined, then the user is not logged in
		return user !== undefined;
	}

	async findAll() {
		return await prisma.user.findMany();
	}

	async findMe(id: number) {
		return await prisma.user.findUnique({
			where: { id }
		});
	}

	async updateMe(id: number, updateUserDto: UpdateUserDto) {
		return await prisma.user.update({
			where: { id },
			data: updateUserDto,
		});
	}

	async removeMe(id: number) {
		return await prisma.user.delete({
			where: { id }
		});
	}

	async findOne(username: string) {
		return await prisma.user.findUnique({
			where: { nickname: username }
		});
	}

	async updateOne(username: string, updateUserDto: UpdateUserDto) {
		return await prisma.user.update({
			where: { nickname: username },
			data: updateUserDto,
		});
	}
}
