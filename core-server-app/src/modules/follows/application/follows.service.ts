import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { FollowsRepository } from '../infrastructure/follows.repository';
import { ProfileRepository } from 'src/modules/profiles/infrastructure/profile.repository';

@Injectable()
export class FollowsService {
  constructor(
    private readonly followsRepo: FollowsRepository,
    private readonly profileRepo: ProfileRepository,
  ) {}

  async followUser(followerUserId: string, targetUsername: string) {
    const follower = await this.profileRepo.findByUserId(followerUserId);
    if (!follower) throw new NotFoundException('Current profile not found');

    const target = await this.profileRepo.findByUsername(targetUsername);
    if (!target) throw new NotFoundException('Target user not found');

    if (follower.id === target.id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Проверяем, есть ли уже связь (любая: pending или accepted)
    const existingFollow = await this.followsRepo.getFollowStatus(
      follower.id,
      target.id,
    );

    if (existingFollow) {
      if (existingFollow.status === 'pending') {
        throw new ConflictException('Request already sent');
      }
      throw new ConflictException('Already following');
    }

    // 🔥 ЛОГИКА ПРИВАТНОСТИ
    // Если профиль закрыт -> pending, иначе -> accepted
    const status = target.isPrivate ? 'pending' : 'accepted';

    await this.followsRepo.create(follower.id, target.id, status);

    // Возвращаем разный ответ для фронта
    if (status === 'pending') {
      return { message: 'Request sent', status: 'pending' };
    }

    return {
      message: `You are now following ${targetUsername}`,
      status: 'accepted',
    };
  }

  async unfollowUser(followerUserId: string, targetUsername: string) {
    const follower = await this.profileRepo.findByUserId(followerUserId);
    const target = await this.profileRepo.findByUsername(targetUsername);

    if (!follower || !target) throw new NotFoundException('Profile not found');

    await this.followsRepo.delete(follower.id, target.id);
    return { message: `Unfollowed ${targetUsername}` };
  }

  async getMyRequests(userId: string) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    return this.followsRepo.getIncomingRequests(profile.id);
  }
  async acceptRequest(userId: string, followerUsername: string) {
    const myProfile = await this.profileRepo.findByUserId(userId);
    const followerProfile =
      await this.profileRepo.findByUsername(followerUsername);

    if (!myProfile || !followerProfile)
      throw new NotFoundException('Profile not found');

    // Обновляем статус на accepted
    await this.followsRepo.acceptRequest(followerProfile.id, myProfile.id);

    return { message: `You accepted ${followerUsername}'s request` };
  }

  async declineRequest(userId: string, followerUsername: string) {
    // Используем логику удаления, только "наоборот" (удаляем того, кто подписался на меня)
    const myProfile = await this.profileRepo.findByUserId(userId);
    const followerProfile =
      await this.profileRepo.findByUsername(followerUsername);

    if (!myProfile || !followerProfile)
      throw new NotFoundException('Profile not found');

    await this.followsRepo.delete(followerProfile.id, myProfile.id);
    return { message: 'Request declined' };
  }

  async getFollowStatus(followerUserId: string, targetUsername: string) {
    // 1. Сначала находим ПРОФИЛЬ того, кто спрашивает (follower)
    const followerProfile = await this.profileRepo.findByUserId(followerUserId);
    if (!followerProfile) return { status: 'none' };

    // 2. Находим ПРОФИЛЬ того, кого проверяем (target)
    const targetProfile = await this.profileRepo.findByUsername(targetUsername);
    if (!targetProfile) throw new NotFoundException('Target user not found');

    // 3. Ищем связь между ДВУМЯ ПРОФИЛЯМИ (не UserID!)
    const follow = await this.followsRepo.getFollowStatus(
      followerProfile.id,
      targetProfile.id,
    );

    if (!follow) {
      return { status: 'none' };
    }

    return { status: follow.status };
  }
}
