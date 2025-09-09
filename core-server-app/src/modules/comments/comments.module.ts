import { Module } from '@nestjs/common';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/domain/user.entity';
import { Post } from '../posts/domain/post.entity';
import { Comment } from './domain/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post])],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsRepository],
})
export class CommentsModule {}
