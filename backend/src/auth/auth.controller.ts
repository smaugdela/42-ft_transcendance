import { Controller, Get, UseGuards, Req, Res, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
// import AuthDto from './dto/auth.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { Request, Response } from 'express';
import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

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
		return this.authService.googleAuth(req, response);
	}

	@Get('protected')
	// @UseGuards(GoogleAuthGuard)
	async protectedEndpoint(@Req() req: Request) {

		const accessToken = req.cookies.accessToken;

		console.log("cookie: ", req.cookies.accessToken);

		const user = await prisma.user.findFirst({
			where: {
				accessToken,
		}
	});

		console.log("user: ", user);

		if (!user)
			throw new ForbiddenException('Unauthorized access');

		return "This is a protected route, and you are able to access it!"
	}

	@Get('unprotected')
	unprotectedEndpoint() {
		return "This is a unprotected route."
	}

}
