import { ForbiddenException, Injectable, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { PrismaClient, AuthType } from '@prisma/client';
import * as argon from 'argon2';
import AuthDto from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

const hashingConfig = {
	parallelism: 1,
	memoryCost: 64000, // 64 mb
	timeCost: 3
};
const prisma = new PrismaClient();

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) { }

	async redirect42(@Query() query, @Res({ passthrough: true }) res: Response) {

		try {

			// Getting the users's token from the 42API.
			const url = 'https://api.intra.42.fr/oauth/token';
			const data = {
				grant_type: 'authorization_code',
				client_id: process.env.ID_42,
				client_secret: process.env.SECRET_42,
				code: query.code,
				redirect_uri: process.env.CALLBACK_URL_42,
			}

			let response = await axios.post(url, data);
			const accessToken = response.data.access_token;

			// Getting user's information using its token.
			const config = {
				headers: {
					Authorization: 'Bearer ' + accessToken,
				},
			};
			response = await axios.get('https://api.intra.42.fr/v2/me', config);

			// Storing user in database.
			const user = response.data;
			let userDb = await prisma.user.findUnique({
				where: {
					id42: user.id,
				}
			});
			if (!userDb) {

				// If the user already exists, we add a number to its nickname.
				let name = user.login;
				let i = 1;
				while (await prisma.user.findUnique({ where: { nickname: name, } })) {
					name = user.login + i;
					i++;
				}

				console.log("Creating 42 user.")
				response = await axios.get('https://api.intra.42.fr/v2/users/' + user.id + '/coalitions', config);
				userDb = await prisma.user.create({
					data: {
						nickname: name,
						id42: user.id,
						coalition: response.data[response.data.length - 1].name,
						authtype: AuthType.FORTYTWO,
						token42: accessToken,
						avatar: user.image.link,
						email: user.email,
					}
				});
			}

			console.log("User 42 logged in: ", userDb);

			await this.generateToken(userDb.id, res);

			// this.webSocketGateway.server.emit('activity', userDb.nickname);

			// res.send("Successfully logged with 42.");
			return "Successfully logged with 42.";

		} catch (error) {
			// if (error.response) {
			// 	// The client was given an error response (5xx, 4xx)
			// 	console.log(error.response.data);
			// 	console.log(error.response.status);
			// 	console.log(error.response.headers);
			// } else if (error.request) {
			// 	// The client never received a response, and the request was never left
			// 	console.log(error.request);
			// } else {
			// 	// Anything else
			// 	console.log("error: ", error.message);
			// }

			throw new ForbiddenException('Invalid resolution from 42 API.');

			return 'An error occured while logging with 42.';
		}
	}

	async login(body: AuthDto, @Res({ passthrough: true }) res: Response) {
		// Find the user by nickname.
		// If the user doesn't exists, throw an error.
		try {
			const activeUser = await prisma.user.findUniqueOrThrow({
				where: { nickname: body.nickname },
			})

			// Compare passwords.
			// If they don't match, throw an exception.
			const pwMatch = await argon.verify(activeUser.password, body.password, hashingConfig);
			if (pwMatch === false)
				throw new ForbiddenException('Password incorrect');

			console.log("User", body.nickname, "logged in.");

			await this.generateToken(activeUser.id, res);

			// this.webSocketGateway.server.emit('activity', activeUser.nickname);

			// res.send("Successfully logged!");
			return "Successfully logged!";

		} catch (error) {
			if (error.code === 'P2025')
				throw new ForbiddenException('No such nickname');
			else
				throw new ForbiddenException('Invalid login. Have you signed up?');
		}
	}

	async signup(body: AuthDto, @Res({ passthrough: true }) res: Response) {

		try {
			// generate password hash
			const { randomBytes } = await import('crypto');
			const buf = randomBytes(16);
			const hash = await argon.hash(body.password, {
				...hashingConfig,
				salt: buf
			});

			// save the new user in the db
			const newUser = await prisma.user.create({
				data: {
					nickname: body.nickname,
					password: hash,
					authtype: AuthType.LOGNPWD,
					coalition: "Invite",
				},
			});

			// delete newUser.password;	// Temporary solution, should not be used permanently.

			// log the created user
			console.log('New standard user created: ', newUser);

			await this.generateToken(newUser.id, res);

			// this.webSocketGateway.server.emit('activity', newUser.nickname);

			// res.send("Successfully signed up!");
			return "Successfully signed up!";

		} catch (error) {

			if (error.code === "P2002")
				throw new ForbiddenException('Credentials taken');

			throw error;
		}
	}

	async logout(userId: number, @Res({ passthrough: true }) res: Response) {
		console.log("Logging out user", userId);

		// Delete jwt from cookies.
		res.clearCookie('jwt');

		// We inform everyone that the user is now inactive via websockets.
		// const userDb = await prisma.user.findUnique({
		// 	where: {
		// 		id: userId,
		// 	}
		// });
		// this.webSocketGateway.server.emit('inactivity', userDb.nickname);

		return "Successfully logged out.";
	}

	async generateToken(userId: number, @Res({ passthrough: true }) res: Response) {

		// Generate access JWT.
		const payload = { sub: userId };
		const jwt = await this.jwtService.signAsync(payload, {
			secret: process.env.JWT_SECRET,
			expiresIn: '1d',
		});

		// Add new tokens in cookies.
		res.cookie('jwt', jwt, {
			httpOnly: true, // Ensures that the cookie cannot be accessed via client-side JavaScript
			secure: true, // Only send the cookie over HTTPS
			maxAge: 60 * 60 * 24 * 1000, // Set cookie expiry to 1 day
			signed: true, // Indicates if the cookie should be signed
			sameSite: 'none', // Allow cross-site cookies
		});

		return true;
	}
}
