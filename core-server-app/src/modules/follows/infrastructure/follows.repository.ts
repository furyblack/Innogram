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

  async create(followerId: string, followingId: string): Promise<void> {
    // Используем save с созданием объекта, чтобы сработали хуки TypeORM если есть
    const follow = this.repo.create({ followerId, followingId });
    await this.repo.save(follow);
  }

  async delete(followerId: string, followingId: string): Promise<void> {
    await this.repo.delete({ followerId, followingId });
  }

  // Проверка: уже подписан?
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const exists = await this.repo.findOne({
      where: { followerId, followingId },
    });
    return !!exists;
  }

  // 🔥 ГЛАВНЫЙ МЕТОД ДЛЯ ЛЕНТЫ: Дай мне ID всех, на кого я подписан
  async getFollowingIds(followerId: string): Promise<string[]> {
    const follows = await this.repo.find({
      where: { followerId },
      select: ['followingId'],
    });
    return follows.map((f) => f.followingId);
  }
}
