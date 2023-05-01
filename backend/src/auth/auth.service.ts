import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import AuthDto from './dto/auth.dto';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
@Injectable()
export class AuthService {

	login(body: AuthDto) {
		console.log(body);
		return 'I am login';
	}

	async signup(body: AuthDto) {
		// generate password hash
		const hash = await argon.hash(body.password);

		// save the new user in the db
		const newUser = await prisma.user.create({
			data: {
				nickname: body.nickname,
				password: hash,
			},
		});
		delete newUser.password;

		// return the created user
		console.log(`New user created: ${newUser}`);
		return newUser;
	}
}
