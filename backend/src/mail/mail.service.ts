import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient, ConfirmationStatus } from '@prisma/client';

const prisma = new PrismaClient();

class ConfirmationTokens {
	userId: number;
	token: string;
	date: Date;
}

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) { }

	confirmationTokens: ConfirmationTokens[] = [];

	async confirmationUrl(userId: number, token: string) {
		// Find if token exists
		const index = this.confirmationTokens.findIndex((t) => t.token === token);
		if (index === -1) {
			throw new HttpException('Bad Link', 406);
		}

		// Find if token is expired
		const date = this.confirmationTokens[index].date;
		const now = new Date();
		const diff = now.getTime() - date.getTime();

		// 10 minutes
		if (diff > 10 * 60 * 1000) {
			throw new HttpException('Link Expired', 406);
		}

		if (this.confirmationTokens[index].userId !== userId) {
			throw new HttpException('Bad Link', 406);
		}

		// Delete token
		this.confirmationTokens.splice(index, 1);

		// Update user
		try {
			await prisma.user.update({
				where: { id: userId },
				data: { confirmationStatus: ConfirmationStatus.CONFIRMED },
			});
		} catch (e) {
			throw new HttpException('Bad User', 406);
		}

		return true;
	}

	async sendUserConfirmation(userId: number) {

		await prisma.user.update({
			where: { id: userId },
			data: { confirmationStatus: ConfirmationStatus.PENDING },
		});

		const token = await this.generateToken();
		this.confirmationTokens.push({
			userId,
			token,
			date: new Date(),
		});
		const url = process.env.BACKEND_URL + '/mail/confirmation?token=' + token;

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

		this.cleanup();

	}

	private async generateToken(): Promise<string> {
		const { randomBytes } = await require('crypto');

		let buf = randomBytes(32);
		let token = buf.toString('hex');

		// Check if token already exists
		while (this.confirmationTokens.find((t) => t.token === token)) {
			buf = randomBytes(32);
			token = buf.toString('hex');
		}

		return token;
	}

	private cleanup() {
		const now = new Date();
		this.confirmationTokens = this.confirmationTokens.filter((t) => {
			const diff = now.getTime() - t.date.getTime();
			// 10 minutes
			return diff < 10 * 60 * 1000;
		});
	}

}
