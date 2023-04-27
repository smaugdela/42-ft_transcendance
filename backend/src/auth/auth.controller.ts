import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('signup')
	signup(@Req() req: Request) {
		console.log(req.header);
		console.log(req.body);
		return this.authService.signup();
	}

	@Post('login')
	login(@Req() req: Request) {
		console.log(req.header);
		console.log(req.body);
		return this.authService.login();
	}
}
