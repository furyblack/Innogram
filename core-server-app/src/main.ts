import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

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

  // включаем CORS
  app.enableCors({
    origin: '*', // для разработки; в проде лучше список доменов
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 Core backend running on http://localhost:${port}/api`);
}
bootstrap();
