import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from '../infrastructure/profile.repository';
import { Profile } from '../domain/profile.entity';
// import { UpdateProfileDto } from '../dto/update-profile.dto'; // TODO

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

  // async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Profile> {
  //   const profile = await this.getProfileByUserId(userId);
  //   // ... логика обновления
  //   // ... await this.profileRepo.update(profile.id, dto);
  // }
}
