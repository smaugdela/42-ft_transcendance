import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import * as cookieParser from 'cookie-parser';

@Injectable()
export class SocketsService {

	constructor(private jwtService: JwtService) { }

	async authSocket(cookies: string): Promise<boolean> {
		console.log('cookies:', cookies);
		if (!cookies) {
			return false;
		}

		// Extract token from cookies
		const signedJwt = cookies.split(';').find(c => c.trim().startsWith('jwt=')).replace('jwt=', '');

		console.log('signedJwt:', signedJwt);

		// Unsign cookie in order to get the jwt token
		const jwt = cookieParser.signedCookie(signedJwt, process.env.COOKIE_SECRET);

		console.log('jwt:', jwt);


		// Verify token
		if (!jwt) {
			return false;
		}
		try {
			await this.jwtService.verifyAsync(jwt, {
				secret: jwtConstants.secret,
			});
			console.log("Access token is valid.");
		} catch (error) {
			console.log("error:", error);
			return false;
		}
		return true;
	}
}
