import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';

@Controller('auth')
// @UseGuards(GoogleAuthGuard)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// @Post('login')
	// login(@Body() body: AuthDto) {
	// 	return this.authService.login(body);
	// }

	// @Post('signup')
	// signup(@Body() body: AuthDto) {
	// 	return this.authService.signup(body);
	// }

	@Get('42/redirect')
	async redirect42(@Query() query) {
		return this.authService.redirect42(query);
	}

	@Get('protected')
	@UseGuards(AuthGuard)
	async protectedEndpoint() {
		return "This is a protected route, and you are able to access it!"
	}

	@Get('unprotected')
	unprotectedEndpoint() {
		return "This is a unprotected route."
	}
}
