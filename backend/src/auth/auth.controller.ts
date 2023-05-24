import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';
import { Public } from './guards/public.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('login')
	login(@Body() body: AuthDto) {
		return this.authService.login(body);
	}

	@Public()
	@Post('signup')
	signup(@Body() body: AuthDto) {
		return this.authService.signup(body);
	}

	@Public()
	@Get('42/redirect')
	async redirect42(@Query() query) {
		return this.authService.redirect42(query);
	}

	@Get('protected')
	async protectedEndpoint() {
		return "This is a protected route, and you are able to access it!"
	}

	@Public()
	@Get('unprotected')
	unprotectedEndpoint() {
		return "This is an unprotected route."
	}
}
