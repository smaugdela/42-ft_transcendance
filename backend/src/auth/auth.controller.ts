import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
// import AuthDto from './dto/auth.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { Request } from 'express';

@Controller('auth')
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
	async googleLogin (@Req() req: Request) {
		// console.log("googleLogin req: ", req);
	}

	@Get('google/redirect')
	@UseGuards(GoogleAuthGuard)
	async googleRedirect (@Req() req: Request) {
		return this.authService.googleAuth(req);
	}

	@Get('protected')
	@UseGuards(GoogleAuthGuard)
	protectedEndpoint() {
		return "This is a protected route, and you are able to access it!"
	}

	@Get('unprotected')
	unprotectedEndpoint() {
		return "This is a unprotected route."
	}

}
