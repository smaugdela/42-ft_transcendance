import { Controller, Get, Post, Body, Query, Res, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';
import { Public } from './guards/public.decorator';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
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
	@Post('signup')
	signup(@Body() body: AuthDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.signup(body, res);
	}

	@Public()
	@Get('42/redirect')
	async redirect42(@Query() query, @Res({ passthrough: true }) res: Response) {
		return this.authService.redirect42(query, res);
	}

	@Delete('logout')
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req['user'].sub, res);
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
