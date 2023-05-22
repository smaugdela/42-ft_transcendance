import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as pactum from "pactum";

const prisma = new PrismaClient();

function deleteDb() {
	prisma.$transaction([
		prisma.match.deleteMany(),
		prisma.achievement.deleteMany(),
		prisma.user.deleteMany(),
	]);
}

describe('App e2e', () => {

	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleRef.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
		deleteDb();
		await app.init();
		pactum.request.setBaseUrl(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`)
		await app.listen(process.env.BACKEND_PORT);
	});

	afterAll(() => {
		app.close();
	})

	it.todo('e2e tests');
	it.todo('Login n Password auth logic');
	it.todo('JWT Authorization');
	it.todo('2FA');
	it.todo('Socket.io architecture');

	// Write the tests for all auth endpoints
	describe('Auth', () => {
		describe('42', () => {
			it('should signup using 42', () => {
				return pactum.spec().get('/auth/42/redirect').expectStatus(200);
			});
		});
		const user = {
			nickname: 'test',
			password: 'test',
		};
		const badUser = {
			nickname: 'test',
			password: 'bad',
		};
		describe('login', () => {
			// Should be able to login using nickname and password
			it('should login using nickname and password', () => {
				return pactum.spec().post('/auth/login').withJson(user).expectStatus(200);
			});
		});
		describe('signup', () => {
			// Should be able to signup using nickname and password
			it('should signup using nickname and password', () => {
				return pactum.spec().post('/auth/signup').withJson(user).expectStatus(200);
			});
			// Should not be able to signup using a non existing nickname
			it('should not be able to signup using a non existing nickname', () => {
				return pactum.spec().post('/auth/signup').withJson(badUser).expectStatus(400);
			});
		});
		describe('protected', () => {
			// Should be able to access protected routes
			it('should be able to access protected routes', () => {
				return pactum.spec().get('/auth/protected').expectStatus(200);
			});
			// Should not be able to access protected routes without a valid token
			it('should not be able to access protected routes without a valid token', () => {
				return pactum.spec().get('/auth/protected').expectStatus(403);
			});
		});
		describe('unprotected', () => {
			// Should be able to access unprotected routes
			it('should be able to access unprotected routes', () => {
				return pactum.spec().get('/auth/unprotected').expectStatus(200);
			});
		});
	});

	describe('Users', () => {
		describe('Get me', () => {
			// Should be able to get my own profile
			it('should be able to get my own profile', () => {
				return pactum.spec().get('/users/me').expectStatus(200);
			});
		});
		describe('Get all', () => {
			// Should be able to get all users
			it('should be able to get all users', () => {
				return pactum.spec().get('/users').expectStatus(200);
			});
		});
		describe('Edit me', () => {
			// Should be able to edit my own profile
			it('should be able to edit my own profile', () => {
				return pactum.spec().patch('/users/me').expectStatus(200);
			});
		});
		describe('Delete me', () => {
			// Should be able to delete my own profile
			it('should be able to delete my own profile', () => {
				return pactum.spec().delete('/users/me').expectStatus(200);
			});
		});
		describe('Friend request', () => {

		});
	});
});
