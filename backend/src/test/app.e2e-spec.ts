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
		app.useGlobalPipes(new ValidationPipe({whitelist: true}));
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

	describe('Auth', () => {
		describe('42', () => {
			it('should signup using 42', () => {
				return  pactum.spec().get('/auth/42/redirect').expectStatus(200);
			});
		});
		describe('login', () => {});
		describe('signup', () => {});
		describe('protected', () => {});
		describe('unprotected', () => {});
	});

	describe('Users', () => {
		describe('Get me', () => {});
		describe('Get all', () => {});
		describe('Edit me', () => {});
		describe('Delete me', () => {});
		describe('Friend request', () => {});
	});
});
