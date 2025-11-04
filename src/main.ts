import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config({ path: './.env' });

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.enableCors();

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
