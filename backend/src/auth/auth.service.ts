import { Injectable, Query } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

// import * as argon from 'argon2';
// const crypto = require('crypto');
// const hashingConfig = {
	// 	parallelism: 1,
	// 	memoryCost: 64000, // 64 mb
	// 	timeCost: 3
	// };

const prisma = new PrismaClient();
@Injectable()
export class AuthService {

	async redirect42(@Query() query) {
		// console.log('query.code: ', query.code);

		const url = 'https://api.intra.42.fr/oauth/token';
		const data = {
			grant_type: 'authorization_code',
			client_id: process.env.ID,
			client_secret: process.env.SECRET,
			code: query.code,
			redirect_uri: process.env.CALLBACK_URL,
		}

		const response = await axios.post(url, data);

		const config = {
			headers: {
			  Authorization: 'Bearer ' + response.data.access_token,
			},
		  };
		const userData = await axios.get('https://api.intra.42.fr/v2/me', config);

		console.log("userData: ", userData.data);

		return 'You are logged in via 42!';
	}

	// async login(body: AuthDto) {
	// 	// Find the user by nickname.
	// 	// If the user doesn't exists, throw an error.
	// 	try {
	// 		const activeUser = await prisma.user.findUniqueOrThrow({
	// 			where: { nickname: body.nickname },
	// 		})

	// 	// Compare passwords.
	// 	// If they don't match, throw an exception.
	// 	const pwMatch = await argon.verify(activeUser.password, body.password, hashingConfig);
	// 	if (pwMatch === false)
	// 		throw new ForbiddenException('Password incorrect');

	// 	// Send back the user.

	// 	delete activeUser.password;	// Temporary solution, should not be used later.

	// 	return activeUser;

	// 	} catch (error) {
	// 		if (error.code === 'P2025')
	// 			throw new ForbiddenException('No such nickname');
	// 		else
	// 			throw error;
	// 	}
	// }

	// async signup(body: AuthDto) {

	// 	try {
	// 		// generate password hash
	// 		const buf: Buffer = crypto.randomBytes(16);
	// 		const hash = await argon.hash(body.password, {
	// 			...hashingConfig,
	// 			salt: buf
	// 		});

	// 		// save the new user in the db
	// 		const newUser = await prisma.user.create({
	// 			data: {
	// 				nickname: body.nickname,
	// 				password: hash,
            // coalition: "Invite",
	// 			},
	// 		});

	// 		delete newUser.password;	// Temporary solution, should not be used permanently.

	// 		// return the created user
	// 		console.log(`New user created: ${newUser}`);
	// 		return newUser;
	// 	} catch (error) {

	// 		if (error.code === "P2002")
	// 			throw new ForbiddenException('Credentials taken');

	// 		throw error;
	// 	}
	// }

	// async googleAuth(@Request() req, @Res() response: Response) {

	// 	if (!req.user) {
	// 		return 'No user from google';
	// 	}

	// 	console.log("Google returned this user: ", req.user);

	// 	const logUser: AuthDto = req.user;
	// 	console.log("User: ", logUser);

	// 	let userDb = await prisma.user.findUnique({
	// 		where: {
	// 			nickname: logUser.nickname,
	// 		}
	// 	});

	// 	if (!userDb)
	// 	{
	// 		userDb = await prisma.user.create({
	// 			data: logUser
	// 		});
	// 		console.log("User created.");
	// 	}
	// 	else
	// 	{
	// 		await prisma.user.update({
	// 			where: {
	// 				id: userDb.id,
	// 			},
	// 			data: {
	// 				accessToken: req.user.accessToken,
	// 			}
	// 		});
	// 	}

	// 	response.cookie('accessToken', req.user.accessToken);
	// 	response.cookie('id', userDb.id);

	// 	return 'Successfully connected to google.';
	// }
}
