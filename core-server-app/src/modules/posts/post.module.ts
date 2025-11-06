import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './infrastructure/posts.repository';
import { Post } from './domain/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// ❌ import { User } from '../users/domain/user.entity';
import { ProfilesModule } from '../profiles/profile.module'; // ✅
import { Profile } from '../profiles/domain/profile.entity'; // ✅

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Profile]), // <-- ИЗМЕНЕНО
    ProfilesModule, // <-- ИМПОРТ
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService, PostsRepository],
})
export class PostsModule {}
