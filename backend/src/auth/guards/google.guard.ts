import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google-oauth20') implements CanActivate {
	constructor() {
		super({
			accesstype: 'offline',
		});
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>
	{
		console.log('I am canActivate.');
		return super.canActivate(context);
	}
}
