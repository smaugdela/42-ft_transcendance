import { CanActivate, Injectable, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class AuthGuard implements CanActivate {

	async canActivate(context: ExecutionContext): Promise<boolean>
	{
		const request = context.switchToHttp().getRequest();

		const id: number = request.cookies.id;
		const accessToken: string = request.cookies.accessToken;

		const user = await prisma.user.findUnique({
			where: {
				id: +id,
			}
		});

		if (!user)
			throw new ForbiddenException('Unauthorized access');
		else if (user.accessToken !== accessToken)
			throw new ForbiddenException('Invalid Access Token.')

		return true;
	}
}
