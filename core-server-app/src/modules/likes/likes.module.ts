import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './domain/post-like.entity';
import { CommentLike } from './domain/comment-like.entity';
import { PostLikeRepository } from './infrastructure/post-like.repository';
import { CommentLikeRepository } from './infrastructure/comment-like.repository';
import { LikesService } from './application/likes.service'; // <-- РАСКОММЕНТИРОВАНО
import {
  PostLikesController,
  CommentLikesController,
} from './api/likes.controller'; // <-- ИЗМЕНЕНО
import { ProfilesModule } from '../profiles/profile.module'; // <-- ДОБАВЛЕНО
import { PostsModule } from '../posts/post.module'; // <-- ДОБАВЛЕНО
import { CommentsModule } from '../comments/comments.module'; // <-- ДОБАВЛЕНО

@Module({
  imports: [
    TypeOrmModule.forFeature([PostLike, CommentLike]),
    // Импортируем модули, чтобы иметь доступ к их репозиториям
    ProfilesModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [PostLikesController, CommentLikesController], // <-- ДОБАВЛЕНО
  providers: [
    LikesService, // <-- РАСКОММЕНТИРОВАНО
    PostLikeRepository,
    CommentLikeRepository,
  ],
  exports: [PostLikeRepository, CommentLikeRepository],
})
export class LikesModule {}
