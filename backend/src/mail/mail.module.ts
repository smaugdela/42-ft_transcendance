import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Global()
@Module({
	imports: [
		MailerModule.forRoot({
			// transport: 'smtps://user@example.com:topsecret@smtp.example.com',
			// or
			transport: {
				host: 'smtp.DaftPong.com',
				secure: true,
				auth: {
					user: 'mailer@DaftPong.com',
					pass: 'topsecret',
				},
			},
			defaults: {
				from: '"Daft Pong" <noreply@DaftPong.com>',
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
	exports: [MailService], // 👈 export for DI
})

export class MailModule { }
