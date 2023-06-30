import { Injectable } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class SocketsService {

	constructor(private jwtService: JwtService) { }

	async authSocket(cookie: string): Promise<boolean> {

		if (!cookie)
			return false;

		// We extract the jwt from the cookies
		const jwt: string = cookie.split('; ').find((cookie: string) => cookie.startsWith('jwt')).split('=')[1];
		if (!jwt)
			return false;

		// We unsign th jwt cookie to make it readable
		const unsignedJwt = cookieParser.signedCookie(decodeURIComponent(jwt), process.env.COOKIE_SECRET);
		if (!unsignedJwt)
			return false;

		// We check the token's validity
		try {
			await this.jwtService.verifyAsync(unsignedJwt, {
				secret: jwtConstants.secret,
			});
		} catch (error) {
			return false
		}
		return true;
	}
}
