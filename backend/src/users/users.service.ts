import { ConflictException, HttpException, Injectable, Res } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient, Prisma } from '@prisma/client';
import { Response } from 'express';
import * as argon from 'argon2';
import { MailService } from 'src/mail/mail.service';

const hashingConfig = {
	parallelism: 1,
	memoryCost: 64000, // 64 mb
	timeCost: 3
};
const prisma = new PrismaClient();

@Injectable()
export class UsersService {

	constructor(private mailService: MailService) { }

	checkIfLoggedIn(userId: number | undefined): boolean {
		// If id is undefined, then the user is not logged in.
		return userId !== undefined;
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
			await prisma.user.update({
				where: { id },
				data: updateUserDto,
			});
			if (updateUserDto.email !== undefined) {
				// Send confirmation email
				this.mailService.sendUserConfirmation(id);
			}
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
		return await prisma.user.findUnique({
			where: { nickname: username }
		});
	}

	async findOneById(id: number) {
		return await prisma.user.findUnique({
			where: { id: id }
		});
	}

	async updateOne(username: string, updateUserDto: UpdateUserDto) {
		return await prisma.user.update({
			where: { nickname: username },
			data: updateUserDto,
		});
	}
}

