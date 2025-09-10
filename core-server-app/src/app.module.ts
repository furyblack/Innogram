import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <--- ИМПОРТ
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentsModule } from './modules/comments/comments.module';
import { UsersModule } from './modules/users/user.module';
import { PostsModule } from './modules/posts/post.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Подключаем ConfigModule, чтобы он читал .env файлы и переменные окружения
    ConfigModule.forRoot({
      isGlobal: true, // Делаем его доступным во всем приложении
      envFilePath: '.env', // Указываем, какой файл читать (для локальной разработки)
    }),

    // 2. Настраиваем TypeOrmModule асинхронно, чтобы использовать ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Импортируем ConfigModule
      inject: [ConfigService], // Внедряем ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // 3. Берем значения из переменных окружения
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
