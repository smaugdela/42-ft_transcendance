import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { MailController } from './mail.controller';

@Global()
@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: "smtp-mail.outlook.com", // hostname
				secure: false, // TLS requires secureConnection to be false
				port: 587, // port for secure SMTP
				tls: {
					ciphers: 'SSLv3'
				},
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PASSWORD
				},
			},
			defaults: {
				from: '"Daft Pong" <daftpong@outlook.com>',
			},
			template: {
				dir: join(__dirname, 'templates'),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}),
	],
	providers: [MailService],
	exports: [MailService],
	controllers: [MailController], // 👈 export for DI
})

export class MailModule { }
