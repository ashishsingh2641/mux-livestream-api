import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

dotenv.config({ path: './.env' });
const logger = new Logger('Bootstrap');

async function bootstrap() {
  let port = process.env.PORT || 3000;

  const keyPath = process.env.SSL_KEY_PATH;
  const certPath = process.env.SSL_CERT_PATH;

  let app;
  let protocol = 'http';

  if (
    keyPath &&
    certPath &&
    fs.existsSync(keyPath) &&
    fs.existsSync(certPath)
  ) {
    // HTTPS Configuration
    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    app = await NestFactory.create(AppModule, {
      httpsOptions,
    });
    port = process.env.HTTPS_PORT;
    protocol = 'https';
    logger.log('Starting server with HTTPS...');
  } else {
    // HTTP Configuration (Default)
    app = await NestFactory.create(AppModule);
    logger.log('Starting server with HTTP...');
  }
  app.enableCors();

  await app.listen(port);
    
  console.log(`🚀 Server running on ${protocol}://localhost:${port}`);
}

bootstrap();
