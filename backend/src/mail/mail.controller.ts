import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { MailService } from './mail.service';
import { Request } from 'express';

@Controller('mail')
export class MailController {

	constructor(private mailService: MailService) { }

	@Redirect(process.env.FRONTEND_URL + '/Settings')
	@Get('confirmation')
	async confirmation(@Req() req: Request) {
		const token = req.query.token as string;
		return await this.mailService.confirmationUrl(req.userId, token);
	}

}
