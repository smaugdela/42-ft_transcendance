import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-oauth20') {
	constructor() {
		super({
			clientID: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
			scope: ['profile'],
		  });
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>
	{
		const { name, photos } = profile;
		const user = {
		  nickname: name.givenName,
		  avatar: photos[0].value,
		  accessToken,
		  refreshToken,
		};

		done(null, user);
	}
}
