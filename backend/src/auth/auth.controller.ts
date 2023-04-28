import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	login(@Body() body: AuthDto) {
		return this.authService.login(body);
	}

	@Post('signup')
	signup(@Body() body: AuthDto) {
		return this.authService.signup(body);
	}
}
