import { Module } from '@nestjs/common';
import { CommentsRepository } from './infrastructure/comments.repository';
import {
  CommentActionsController,
  CommentsController,
} from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// ❌ import { User } from '../users/domain/user.entity';
// ❌ import { Post } from '../posts/domain/post.entity';
import { Comment } from './domain/comments.entity';
import { PostsModule } from '../posts/post.module';
// ❌ import { UsersModule } from '../users/user.module';
import { ProfilesModule } from '../profiles/profile.module'; // ✅

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]), // <-- Оставляем только Comment
    PostsModule, // Импортируем, чтобы иметь доступ к PostsRepository
    ProfilesModule, // <-- Импортируем, чтобы иметь доступ к ProfileRepository
  ],
  controllers: [CommentsController, CommentActionsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsRepository],
})
export class CommentsModule {}
