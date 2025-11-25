import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from '../domain/post-like.entity';
import { Profile } from 'src/modules/profiles/domain/profile.entity';
import { Post } from 'src/modules/posts/domain/post.entity';

@Injectable()
export class PostLikeRepository {
  constructor(
    @InjectRepository(PostLike)
    private readonly repo: Repository<PostLike>,
  ) {}

  /**
   * Находит лайк по ID профиля и ID поста
   */
  async findOneByProfileAndPost(
    profileId: string,
    postId: string,
  ): Promise<PostLike | null> {
    return this.repo.findOne({
      where: {
        profileId: profileId,
        postId: postId,
      },
    });
  }

  /**
   * Создает новый лайк для поста
   */
  async create(profile: Profile, post: Post): Promise<PostLike> {
    const like = this.repo.create({
      profile: profile,
      post: post,
    });
    return this.repo.save(like);
  }

  /**
   * Удаляет лайк по его ID
   */
  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
