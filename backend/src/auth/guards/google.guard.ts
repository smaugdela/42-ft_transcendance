import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google-oauth20') {
	constructor() {
		super({
			accesstype: 'offline',
		});
	}
}