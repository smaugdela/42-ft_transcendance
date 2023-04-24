import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let port = Number(process.env.BACKEND_PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

	if (Number.isNaN(port) == true)
		port = 3001;

  await app.listen(port);
  console.log(`Backend started on port ${port}`);
}
bootstrap();
