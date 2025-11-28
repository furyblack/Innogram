import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // глобальные пайпы для валидации DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // убираем лишние поля
      forbidNonWhitelisted: true, // кидаем ошибку если пришло лишнее поле
      transform: true, // преобразуем типы
    }),
  );

  // глобальный префикс для API
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  // Раздача статических файлов из папки uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // включаем CORS
  app.enableCors({
    origin: '*', // для разработки; в проде лучше список доменов
  });

  const PORT = parseInt(process.env.PORT || '3001', 10);
  await app.listen(PORT);
  Logger.log(`🚀 Core backend running on http://localhost:${PORT}/api`);
}
bootstrap();
