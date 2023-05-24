import { CanActivate, Injectable, ExecutionContext, UnauthorizedException, Headers } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService, private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {

		// We first check if it's a public endpoint.
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		  ]);
		  if (isPublic) {
			return true;
		  }

		// We extract the jwt from the request.
		const request = context.switchToHttp().getRequest();
		const jwt = this.extractTokenFromHeader(request.headers);

		// Check if the jwt exists and is valid.
		if (!jwt)
		{
			throw new UnauthorizedException('No access token.');
		}
		try {
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
