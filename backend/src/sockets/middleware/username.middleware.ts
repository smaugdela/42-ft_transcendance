import { UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as cookieParser from 'cookie-parser';
import { jwtConstants } from 'src/auth/constants';
import { Activity, PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();

export function usernameMiddleware(jwtService: JwtService) {
	return async (client: Socket, next: (err?: any) => void) => {

		const cookie: string = client.handshake.headers.cookie;
		if (!cookie)
			return next(new UnauthorizedException('No cookies, no access.'));

		// We extract the jwt from the cookies
		const jwt: string = cookie.split('; ').find((cookie: string) => cookie.startsWith('jwt')).split('=')[1];
		if (!jwt)
			return next(new UnauthorizedException('No token found.'));

		// We unsign the jwt cookie to make it readable
		const unsignedJwt = cookieParser.signedCookie(decodeURIComponent(jwt), process.env.COOKIE_SECRET);
		if (!unsignedJwt)
			return next(new UnauthorizedException('Bad cookie signature.'));

		// We check the token's validity
		try {
			const payload = await jwtService.verifyAsync(unsignedJwt, {
				secret: jwtConstants.secret,
			});

			if (!payload)
				return next(new UnauthorizedException('Bad token payload.'));
			const userId = payload.sub;

			// We check if the user exists
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					id: userId,
				},
			});
			if (!user)
				return next(new UnauthorizedException('No user associated with this token.'));

			// We tell that the user is active
			if (user.isActive === Activity.OFFLINE) {
				await prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						isActive: Activity.ONLINE,
					},
				});
			}

			// We add the username to the socket instance for identification
			client.data.username = user.nickname;
			client.data.userId = user.id;

		} catch (error) {
			return next(new UnauthorizedException('Bad token.'));
		}

		next();
	}
}
