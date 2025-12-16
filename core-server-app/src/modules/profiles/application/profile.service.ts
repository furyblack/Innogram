import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from '../infrastructure/profile.repository';
import { Profile } from '../domain/profile.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepo: ProfileRepository) {}

  // Получить свой профиль по User ID из JWT
  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  // Получить чужой профиль по его username
  async getProfileByUsername(username: string): Promise<Profile> {
    const profile = await this.profileRepo.findByUsername(username);
    if (!profile) throw new NotFoundException('Profile not found');
    // TODO: Проверить `is_public`
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    // Обновляем поля, если они пришли
    if (dto.displayName) profile.displayName = dto.displayName;
    if (dto.bio) profile.bio = dto.bio;
    if (dto.avatarUrl) profile.avatarUrl = dto.avatarUrl;

    // Сохраняем (TypeORM сам поймет, что это update, т.к. есть id)
    return this.profileRepo.save(profile);
  }
  async searchProfiles(query: string) {
    return this.profileRepo.searchProfiles(query);
  }
}
