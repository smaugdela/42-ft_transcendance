import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// curl -X POST localhost:3001/users -H 'Content-Type: application/json' -d '{"nickname": "Zion","password": "test"}'

// async function pushToDB_User (path: string)
// {
// 	const prisma = new PrismaClient();
// 	const jsonString = fs.readFileSync(path, 'utf-8');
// 	const Data = JSON.parse(jsonString);

// 	Data.forEach(async element => {
// 		await prisma.user.create({
// 			data: {
// 				avatar: element.avatar,
// 				nickname: element.nickname,
// 				mailAddress: element.mailAddress,
// 				coalition: element.coalition,
// 				accessToken: "default",
// 				password: "default",
// 		  },}).catch( (error) => console.log(error) );
// 	});
// }

async function bootstrap() {

	const port = Number(process.env.BACKEND_PORT);
	if (isNaN(port)) {
		console.log("Error: backend port undefined in .env file.")
		return;
	}

	const httpsOptions = {
		key: fs.readFileSync('/home/smagdela/Documents/42-ft_transcendance/backend/src/localhost-key.pem'),
		cert: fs.readFileSync('/home/smagdela/Documents/42-ft_transcendance/backend/src/localhost.pem'),
		logger: console,
	};

	const app = await NestFactory.create(AppModule, { httpsOptions });

	// Swagger config
	const config = new DocumentBuilder()
		.setTitle('Daft Pong API')
		.setDescription('Our transcendance API UI using swagger')
		.setVersion('0.42')
		.addTag('Daft Pong')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);

	// pushToDB_User('../database/user_data.json'); // Use this only to load test data
	// console.log("Data loaded into db");

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	app.use(cookieParser(process.env.COOKIE_SECRET));

	app.enableCors({
		credentials: true,
		origin: process.env.FRONTEND_URL,
	});

	await app.listen(port);

	console.log(`Backend started on port ${port}`);
}

bootstrap();
