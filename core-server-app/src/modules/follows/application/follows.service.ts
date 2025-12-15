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
    // 1. Кто подписывается? (Я)
    const follower = await this.profileRepo.findByUserId(followerUserId);
    if (!follower) throw new NotFoundException('Current profile not found');

    // 2. На кого? (Цель)
    const target = await this.profileRepo.findByUsername(targetUsername);
    if (!target) throw new NotFoundException('Target user not found');

    // 3. Нельзя подписаться на себя
    if (follower.id === target.id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // 4. Уже подписан?
    const isAlreadyFollowing = await this.followsRepo.isFollowing(
      follower.id,
      target.id,
    );
    if (isAlreadyFollowing) {
      throw new ConflictException('Already following');
    }

    // 5. Действие
    await this.followsRepo.create(follower.id, target.id);
    return { message: `You are now following ${targetUsername}` };
  }

  async unfollowUser(followerUserId: string, targetUsername: string) {
    const follower = await this.profileRepo.findByUserId(followerUserId);
    const target = await this.profileRepo.findByUsername(targetUsername);

    if (!follower || !target) throw new NotFoundException('Profile not found');

    await this.followsRepo.delete(follower.id, target.id);
    return { message: `Unfollowed ${targetUsername}` };
  }
}
