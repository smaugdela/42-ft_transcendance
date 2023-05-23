import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";
import { Observable } from "rxjs";
import { jwtConstants } from "../constants";
import { JwtService } from "@nestjs/jwt";

const prisma = new PrismaClient();

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService);

	async canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const jwt = this.extractTokenFromHeader(request);

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

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
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
