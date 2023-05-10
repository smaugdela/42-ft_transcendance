import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { AuthGuard } from './guards/auth.guard';
import { Request, Response } from 'express';

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

	@Get('google')
	@UseGuards(GoogleAuthGuard)
	googleLogin () {
		return 'Login';
	}

	@Get('google/redirect')
	@UseGuards(GoogleAuthGuard)
	async googleRedirect (@Req() req: Request, @Res({ passthrough: true }) response: Response) {
		// return this.authService.googleAuth(req, response);
		return "Successfully logged to google."
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
