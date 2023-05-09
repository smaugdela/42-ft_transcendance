import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

// curl -X POST localhost:3001/users -H 'Content-Type: application/json' -d '{"nickname": "Zion","password": "test"}'

async function pushToDB_User (path: string)
{
	const prisma = new PrismaClient();
	const jsonString = fs.readFileSync(path, 'utf-8');
	const Data = JSON.parse(jsonString);

	Data.forEach(async element => {
		await prisma.user.create({
			data: {
				avatar: element.avatar,
				nickname: element.nickname,
				mailAddress: element.mailAddress,
				coalition: element.coalition,
				password: "default",
		  },}).catch( (error) => console.log(error) );
	});
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {logger: console,});

	pushToDB_User('../database/user_data.json'); // Use this only to load test data

	console.log("Data loaded into db");

	const port = Number(process.env.BACKEND_PORT) || 3001;

	app.useGlobalPipes(new ValidationPipe({whitelist: true}));

	app.enableCors();

	await app.listen(port);

	console.log(`Backend started on port ${port}`);
}
bootstrap();
