import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) { }

	async sendUserConfirmation(userId: number, token: string) {
		const url = `example.com/auth/confirm?token=${token}`;

		try {
			const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

			await this.mailerService.sendMail({
				to: user.email,
				// from: '"Support Team" <support@example.com>', // override default from
				subject: 'Welcome to Daft Pong! Confirm your Email',
				template: './confirmation', // `.hbs` extension is appended automatically
				context: {
					name: user.nickname,
					url,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}
}