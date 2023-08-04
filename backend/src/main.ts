import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

	const port = Number(process.env.BACKEND_PORT);
	if (isNaN(port)) {
		console.log("Error: backend port undefined in .env file.")
		return;
	}

	const httpsOptions = {
		key: fs.readFileSync(process.env.HTTPS_KEY),
		cert: fs.readFileSync(process.env.HTTPS_CERT),
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

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	app.use(cookieParser(process.env.COOKIE_SECRET));

	const corsConfig = {
		origin: (process.env.DOCKER && process.env.DOCKER) === "true" ? "https://" + process.env.FRONTEND_HOST : process.env.FRONTEND_URL,
		credentials: true
	};

	app.enableCors(corsConfig);

	await app.listen(port);

	console.log(`Backend started on port ${port}`);
}

bootstrap();
