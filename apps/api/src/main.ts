import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Cloudflare Tunnel connects over loopback; trust its X-Forwarded-For so each visitor is limited separately.
  app.set('trust proxy', 'loopback');
  app.setGlobalPrefix('api');
  // Document content arrives as base64 Yjs state, which outgrows the 100kb default.
  app.useBodyParser('json', { limit: '2mb' });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: process.env.WEB_ORIGIN,
    credentials: true,
  });
  // HOST=127.0.0.1 in production keeps the API reachable only from this machine.
  await app.listen(process.env.PORT ?? 3001, process.env.HOST ?? '0.0.0.0');
}
void bootstrap();
