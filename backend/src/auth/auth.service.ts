import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import AuthDto from './dto/auth.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class AuthService {

	async login(body: AuthDto) {

		// Find the user by nickname.
		// If the user doesn't exists, throw an error.
		try {
			const activeUser = await prisma.user.findUniqueOrThrow({
				where: { nickname: body.nickname },
			})

		// Compare passwords.
		// If they don't match, throw an exception.
		const pwMatch = await argon.verify(activeUser.password, body.password);
		if (pwMatch === false)
			throw new ForbiddenException('Password incorrect');

		// Send back the user.

		delete activeUser.password;	// Temporary solution, should not be used later.

		return activeUser;

		} catch (error) {
			if (error.code === 'P2025')
				throw new ForbiddenException('No such nickname');
			else
				throw error;
		}
	}

	async signup(body: AuthDto) {

		try {
			// generate password hash
			const hash = await argon.hash(body.password);

			// save the new user in the db
			const newUser = await prisma.user.create({
				data: {
					nickname: body.nickname,
					password: hash,
				},
			});

			delete newUser.password;	// Temporary solution, should not be used permanently.

			// return the created user
			console.log(`New user created: ${newUser}`);
			return newUser;
		} catch (error) {

			if (error.code === "P2002")
				throw new ForbiddenException('Credentials taken');

			throw error;
		}
	}
}
