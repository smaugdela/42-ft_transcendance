import { CanActivate, Injectable, ExecutionContext, UnauthorizedException, Headers } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { AuthService } from "../auth.service";
import * as argon from 'argon2';
import { PrismaClient } from "@prisma/client";

const hashingConfig = {
	parallelism: 1,
	memoryCost: 64000, // 64 mb
	timeCost: 3
};
const prisma = new PrismaClient();

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService, private reflector: Reflector, private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {

		// We first check if it's a public endpoint.
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		  ]);
		  if (isPublic) {
			return true;
		  }

		// We extract the access jwt from the request.
		const request = context.switchToHttp().getRequest();
		const jwt = this.extractAccessTokenFromHeader(request.headers);

		// Check if the jwt exists and is valid.
		if (!jwt)
		{
			throw new UnauthorizedException('No access token.');
		}
		try {
			const payload = await this.jwtService.verifyAsync(jwt, {
				secret: jwtConstants.secret,
			});
			request['user'] = payload;
		} catch (error) {

			// Access token invalid, fallback to checking the refresh token
			const user = await this.jwtService.decode(jwt);
			if (this.checkRefreshToken(user.indexOf, request.refreshToken))
			{
				this.authService.generateTokens(user['sub'], user['username']);
				return true;
			}

			throw new UnauthorizedException('Bad token.');
		}
		return true;
	}

	private async checkRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
		// Compare tokens.
		// If they don't match, throw an exception.
		const user = await prisma.user.findUnique({
			where: {id: userId},
		});
		const tokMatch = await argon.verify(user.refreshToken, refreshToken, hashingConfig);
		if (tokMatch === false)
			throw new UnauthorizedException('You are not logged in, please log in.');
		return true;
	}

	private extractAccessTokenFromHeader(@Headers() headers): string | undefined {
		const [type, token] = headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	// This next canActivate() function is used in conjunction with cookies and an access token.

	// async canActivate(context: ExecutionContext): Promise<boolean>
	// {
	// 	const request = context.switchToHttp().getRequest();

	// 	const id: number = request.cookies.id;
	// 	const accessToken: string = request.cookies.accessToken;

	// 	const user = await prisma.user.findUnique({
	// 		where: {
	// 			id: +id,
	// 		}
	// 	});

	// 	if (!user)
	// 		throw new ForbiddenException('Unauthorized access');
	// 	else if (user.accessToken !== accessToken)
	// 		throw new ForbiddenException('Invalid Access Token.')

	// 	return true;
	// }
}
