import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google-oauth20') implements CanActivate {
	constructor() {
		super({
			accesstype: 'offline',
		});
	}

	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}

}
