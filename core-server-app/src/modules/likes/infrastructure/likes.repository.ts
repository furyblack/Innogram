import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../domain/likes.entity';
import { User } from 'src/modules/users/domain/user.entity';
import { Post } from 'src/modules/posts/domain/post.entity';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepo: Repository<Like>,
  ) {}

  async findOne(userId: number, postId: number): Promise<Like | null> {
    return this.likesRepo.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });
  }

  async create(user: User, post: Post): Promise<Like> {
    const like = this.likesRepo.create({ user, post });
    return this.likesRepo.save(like);
  }

  async remove(like: Like): Promise<Like> {
    return this.likesRepo.remove(like);
  }
}
