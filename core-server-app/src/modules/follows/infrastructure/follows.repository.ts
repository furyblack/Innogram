import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../domain/follow.entity';

@Injectable()
export class FollowsRepository {
  constructor(
    @InjectRepository(Follow)
    private readonly repo: Repository<Follow>,
  ) {}

  async create(
    followerId: string,
    followingId: string,
    status: 'pending' | 'accepted',
  ): Promise<void> {
    const follow = this.repo.create({ followerId, followingId, status });
    await this.repo.save(follow);
  }

  async delete(followerId: string, followingId: string): Promise<void> {
    await this.repo.delete({ followerId, followingId });
  }

  async getFollowStatus(
    followerId: string,
    followingId: string,
  ): Promise<Follow | null> {
    return this.repo.findOne({
      where: { followerId, followingId },
    });
  }

  // Проверка: уже подписан?
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const exists = await this.repo.findOne({
      where: { followerId, followingId },
    });
    return !!exists;
  }

  async getFollowingIds(followerId: string): Promise<string[]> {
    const follows = await this.repo.find({
      where: { followerId: followerId, status: 'accepted' },
      select: ['followingId'],
    });
    return follows.map((f) => f.followingId);
  }

  async getIncomingRequests(userId: string) {
    return this.repo.find({
      where: { followingId: userId, status: 'pending' },
      relations: ['follower'],
      order: { createdAt: 'DESC' },
    });
  }

  async acceptRequest(followerId: string, myUserId: string) {
    await this.repo.update(
      { followerId, followingId: myUserId },
      { status: 'accepted' },
    );
  }
}
