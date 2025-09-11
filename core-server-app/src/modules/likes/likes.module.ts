import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './domain/likes.entity';
import { LikesController } from './api/likes.controller';
import { LikesService } from './application/likes.service';
import { LikesRepository } from './infrastructure/likes.repository';

// Импортируем модули, от которых мы зависим
import { PostsModule } from 'src/modules/posts/post.module';
import { UsersModule } from 'src/modules/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    PostsModule, // <-- Импортируем, чтобы получить доступ к PostsRepository
    UsersModule, // <-- Импортируем, чтобы получить доступ к UsersRepository
  ],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}
