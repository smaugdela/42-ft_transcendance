import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService, private readonly reflector: Reflector) { }

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
		const request: Request = context.switchToHttp().getRequest();
		// const jwt = this.extractAccessTokenFromHeader(request.headers);
		const jwt = request.signedCookies.jwt;

		// Check if the jwt exists and is valid.
		if (!jwt) {
			throw new UnauthorizedException('No access token.');
		}
		try {
			const payload = await this.jwtService.verifyAsync(jwt, {
				secret: jwtConstants.secret,
			});
			request['user'] = payload;
			console.log("Access token is valid.");
		} catch (error) {
			console.log("Access token is invalid or expired.");
			throw new UnauthorizedException('Bad token.');
		}
		return true;
	}

	// private extractAccessTokenFromHeader(@Headers() headers): string | undefined {
	// 	const [type, token] = headers.authorization?.split(' ') ?? [];
	// 	return type === 'Bearer' ? token : undefined;
	// }

	// private async checkRefreshToken(userId: number, refreshToken: string): Promise<boolean> {

	// 	try {
	// 		// Check if the given refreshToken is valid first.
	// 		const payload = await this.jwtService.verifyAsync(refreshToken, {
	// 			secret: process.env.JWT_SECRET,
	// 		});
	// 		if (payload.id != userId)
	// 			return false;

	// 		const user = await prisma.user.findUnique({
	// 			where: { id: userId },
	// 		});
	// 		console.log("refreshToken:", refreshToken);

	// 		// Compare tokens.
	// 		// If they don't match, throw an exception
	// 		if (!user.refreshToken || !refreshToken)
	// 			return false;
	// 		const tokMatch = await argon.verify(user.refreshToken, refreshToken, hashingConfig);
	// 		if (tokMatch === false)
	// 			return false;
	// 	} catch (error) {
	// 		console.log(error);
	// 		return false;
	// 	}
	// 	return true;
	// }
}
