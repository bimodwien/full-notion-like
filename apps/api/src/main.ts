import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Document content arrives as base64 Yjs state, which outgrows the 100kb default.
  app.useBodyParser('json', { limit: '2mb' });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: process.env.WEB_ORIGIN,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
