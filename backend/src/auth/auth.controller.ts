import { Controller, Get, Post, Body, Query, Res, Delete, Req, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';
import { Public } from './guards/public.decorator';
import { Request, Response } from 'express';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth') // for swagger
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Public()
	@Post('login')
	login(@Body() body: AuthDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.login(body, res);
	}

	@Public()
	@Get('2fa')
	async twoFactorAuth(@Query() query, @Res({ passthrough: true }) res: Response) {
		console.log("Query Code obtained: ", query.code);
		return this.authService.login2FA(query, res);
	}

	@Public()
	@Post('signup')
	signup(@Body() body: AuthDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.signup(body, res);
	}

	@Redirect(process.env.FRONTEND_URL, 302)
	@Public()
	@Get('42/redirect')
	async redirect42(@Query() query, @Res({ passthrough: true }) res: Response) {
		return this.authService.redirect42(query, res);
	}

	@Delete('logout')
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req.userId, res);
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
