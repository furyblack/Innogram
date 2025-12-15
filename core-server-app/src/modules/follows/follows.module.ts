import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './domain/follow.entity';
import { FollowsRepository } from './infrastructure/follows.repository';
import { FollowsService } from './application/follows.service';
import { FollowsController } from './api/follows.controller';
import { ProfilesModule } from '../profiles/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow]),
    ProfilesModule, // Чтобы использовать ProfileRepository
  ],
  controllers: [FollowsController],
  providers: [FollowsService, FollowsRepository],
  exports: [FollowsRepository], // Экспортируем, чтобы PostsModule мог строить ленту!
})
export class FollowsModule {}
