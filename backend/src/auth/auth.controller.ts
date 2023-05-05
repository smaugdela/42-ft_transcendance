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
		console.log("googleLogin req: ", req);
	}

	@Get('google/redirect')
	@UseGuards(GoogleAuthGuard)
	async googleRedirect (@Req() req: Request) {
		// console.log("googleRedirect req: ", req);
		return this.authService.googleAuth(req);
	}

}
