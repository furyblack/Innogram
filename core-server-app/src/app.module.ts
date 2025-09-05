import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/user.module';
import { PostsModule } from './modules/posts/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres', // Или 'postgres', если оба сервиса в одном Docker-compose сети
      port: 5432, // Используйте порт, который вы настроили в docker-compose.yml
      username: 'social_user',
      password: 'social_password',
      database: 'social_network_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Всегда false в продакшене. Используйте миграции!
      logging: true, // Включите, чтобы видеть SQL-запросы в консоли. Удобно для отладки.
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
