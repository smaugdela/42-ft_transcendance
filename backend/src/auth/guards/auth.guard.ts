import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService, private readonly reflector: Reflector) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {

		// We extract the access jwt from the request.
		const request: Request = context.switchToHttp().getRequest();
		// const jwt = this.extractAccessTokenFromHeader(request.headers);
		const jwt = request.signedCookies.jwt;

		if (jwt) {
			const payload = await this.jwtService.decode(jwt, {});
			request.userId = payload.sub;
		}

		// We first check if it's a public endpoint.
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		// Check if the jwt exists and is valid.
		if (!jwt) {
			throw new UnauthorizedException('No access token.');
		}
		try {

			// We verify the jwt.
			await this.jwtService.verifyAsync(jwt, {
				secret: jwtConstants.secret,
			});

			// We check if the user exists in db.
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					id: request.userId,
				}
			});
			if (!user) {
				throw new UnauthorizedException('Bad token.');
			}

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

}
