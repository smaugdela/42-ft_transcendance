import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

let port = Number(process.env.BACKEND_PORT);
const prisma = new PrismaClient();

async function pushToDB_User (path: string)
{
	const jsonString = fs.readFileSync(path, 'utf-8');
	const Data = JSON.parse(jsonString);

	Data.forEach(async element => {
		await prisma.user.create({
			data: {
				avatar: element.avatar,
				nickname: element.nickname,
				mailAddress: element.mailAddress,
				coalition: element.coalition,
		  },});
	});
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {logger: console,});

	pushToDB_User('../database/user_data.json'); // Use this only to load test data

	console.log("Data loaded into db");

	if (Number.isNaN(port) == true)
		port = 3001;

	await app.listen(port);
	console.log(`Backend started on port ${port}`);
}
bootstrap();
