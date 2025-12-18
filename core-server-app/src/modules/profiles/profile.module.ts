import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './domain/profile.entity';
import { ProfileRepository } from './infrastructure/profile.repository';
import { ProfileService } from './application/profile.service';
import {
  ProfileController,
  PublicProfileController,
} from './api/profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController, PublicProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileRepository, ProfileService],
})
export class ProfilesModule {}
