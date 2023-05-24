import { ForbiddenException, Injectable, Query } from '@nestjs/common';
import axios from 'axios';
import { PrismaClient, AuthType } from '@prisma/client';
import * as argon from 'argon2';
import AuthDto from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const hashingConfig = {
	parallelism: 1,
	memoryCost: 64000, // 64 mb
	timeCost: 3
};
const prisma = new PrismaClient();

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	async redirect42(@Query() query) {

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

			// delete user.achievements;
			// delete user.projects_users;
			// console.log("user: ", user);

			if (!userDb) {
				console.log("Creating user.")
				response = await axios.get('https://api.intra.42.fr/v2/users/' + user.id + '/coalitions', config);
				userDb = await prisma.user.create({
					data: {
						nickname: user.login,
						id42: user.id,
						coalition: response.data[response.data.length - 1].name,
						authtype: AuthType.FORTYTWO,
						token42: accessToken,
						avatar: user.image.link,
						email: user.email,
						refreshToken: null
					}
				});
			}

			console.log("user: ", userDb);

			return this.generateTokens(userDb.id, userDb.nickname);

		} catch (error) {
			if (error.response) {
				// The client was given an error response (5xx, 4xx)
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				// The client never received a response, and the request was never left
				console.log(error.request);
			} else {
				// Anything else
				console.log("error: ", error.message);
			}

			return 'An error occured while logging with 42.';
		}
	}

	async login(body: AuthDto) {
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

			return this.generateTokens(activeUser.id, activeUser.nickname);

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
					refreshToken: null,
				},
			});

			// delete newUser.password;	// Temporary solution, should not be used permanently.

			// log the created user
			console.log('New user created: ', newUser);

			return this.generateTokens(newUser.id, newUser.nickname);

		} catch (error) {

			if (error.code === "P2002")
				throw new ForbiddenException('Credentials taken');

			throw error;
		}
	}

	async logout(userId: number)
	{
		return await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				refreshToken: null,
			},
		});
	}

	async generateTokens(userId: number, username: string) {

		// generate refresh JWT.
		const payload = { sub: userId, username: username };
		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: process.env.JWT_SECRET,
			expiresIn: '7d',
		});

		// generate refreshToken hash and store it in DB
		const { randomBytes } = await import('crypto');
		const buf = randomBytes(16);
		const hash = await argon.hash(refreshToken, {
			...hashingConfig,
			salt: buf
		});
		await prisma.user.update({
			where: {
				nickname: username,
			},
			data: {
				refreshToken: hash,
			}
		});

		// return refresh and access JWTs.
		return {
			jwt: await this.jwtService.signAsync(payload, {
				secret: process.env.JWT_SECRET,
				expiresIn: '60s',
			}),
			refreshToken: refreshToken,
		};
	}



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
