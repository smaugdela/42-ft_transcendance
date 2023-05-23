import { CanActivate, Injectable, ExecutionContext, UnauthorizedException, Headers } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const jwt = this.extractTokenFromHeader(request.headers);

		if (!jwt)
		{
			throw new UnauthorizedException('No access token.');
		}
		try {
			console.log('received jwt from header: ', jwt);
			const payload = await this.jwtService.verifyAsync(jwt, {
				secret: jwtConstants.secret,
			});
			request['user'] = payload;
		} catch {
			throw new UnauthorizedException('Bad access token.');
		}
		return true;
	}

	private extractTokenFromHeader(@Headers() headers): string | undefined {
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
