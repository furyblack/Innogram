import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

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

  const config = new DocumentBuilder()
    .setTitle('Innogram API')
    .setDescription('The social network API description')
    .setVersion('1.0')
    .addBearerAuth() // Добавляет кнопку для ввода токена
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(PORT);
  Logger.log(`🚀 Core backend running on http://localhost:${PORT}/api`);
}
bootstrap();
