import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentLike } from '../domain/comment-like.entity';
import { Profile } from 'src/modules/profiles/domain/profile.entity';
import { Comment } from 'src/modules/comments/domain/comments.entity';

@Injectable()
export class CommentLikeRepository {
  constructor(
    @InjectRepository(CommentLike)
    private readonly repo: Repository<CommentLike>,
  ) {}

  /**
   * Находит лайк по ID профиля и ID комментария
   */
  async findOneByProfileAndComment(
    profileId: string,
    commentId: string,
  ): Promise<CommentLike | null> {
    return this.repo.findOne({
      where: {
        profile_id: profileId,
        comment_id: commentId,
      },
    });
  }

  /**
   * Создает новый лайк для комментария
   */
  async create(profile: Profile, comment: Comment): Promise<CommentLike> {
    const like = this.repo.create({
      profile: profile,
      comment: comment,
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
