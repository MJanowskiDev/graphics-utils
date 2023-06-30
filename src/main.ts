import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Logger } from './core/logger/Logger';

async function bootstrap() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
  const app = await NestFactory.create(AppModule, { logger: new Logger() });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
