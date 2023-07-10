import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient, Login2FAStatus } from '@prisma/client';

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
	Tokens2FA: ConfirmationTokens[] = [];

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
				data: { enabled2FA: true },
			});
		} catch (e) {
			throw new HttpException('Bad User', 406);
		}

		return true;
	}

	async sendUserConfirmation(userId: number) {

		const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

		if (user.email === null || user.email === undefined) {
			throw new HttpException('No mail defined.', 406);
		}

		const token = await this.generateToken();
		this.confirmationTokens.push({
			userId,
			token,
			date: new Date(),
		});
		const url = process.env.BACKEND_URL + '/mail/confirmation?token=' + token;

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
	}

	async send2FALoginCode(userId: number) {
		const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

		if (user.email === null || user.email === undefined) {
			throw new HttpException('No mail defined.', 406);
		}

		const code = await this.generateToken();
		this.Tokens2FA.push({
			userId,
			token: code,
			date: new Date(),
		});
		const url = process.env.FRONTEND_URL + '/2fa?code=' + code + '&userId=' + userId;

		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Daft Pong Double Factor Authentication Link',
			template: './2fa', // `.hbs` extension is appended automatically
			context: {
				name: user.nickname,
				url: url,
			},
		});
	}

	async Confirmation2FA(userId: number, token: string) {

		// Find if token exists
		let index = 0;
		while (index < this.Tokens2FA.length && this.Tokens2FA[index].token !== token) {
			index++;
		}
		if (index === this.Tokens2FA.length) {
			return false;
		}

		// Find if token is expired
		const date = this.Tokens2FA[index].date;
		const now = new Date();
		const diff = now.getTime() - date.getTime();

		// 10 minutes
		if (diff > 10 * 60 * 1000) {
			return false;
		}

		if (this.Tokens2FA[index].userId !== userId) {
			return false;
		}

		const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
		if (user.login2FAstatus !== Login2FAStatus.PENDING) {
			return false;
		}

		// Delete token
		this.Tokens2FA.splice(index, 1);


		return true;
	}

	private async generateToken(): Promise<string> {
		const { randomBytes } = await require('crypto');

		this.cleanup();

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
		this.Tokens2FA = this.Tokens2FA.filter((t) => {
			const diff = now.getTime() - t.date.getTime();
			// 10 minutes
			return diff < 10 * 60 * 1000;
		});
	}

}
