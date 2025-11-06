import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { PostsRepository } from 'src/modules/posts/infrastructure/posts.repository';
import { ProfileRepository } from 'src/modules/profiles/infrastructure/profile.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Comment } from '../domain/comments.entity';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepo: CommentsRepository,
    private readonly postsRepo: PostsRepository,
    private readonly profileRepo: ProfileRepository,
  ) {}

  async createComment(
    postId: string,
    userId: string, // (Это User.id из JWT)
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('User Profile not found');
    }

    const post = await this.postsRepo.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.commentsRepo.createComment({
      content: dto.content,
      profile, // Привязываем к профилю
      post,
    });
  }

  async getCommentsByPost(
    postId: string,
    paginationDto: PaginationDto,
  ): Promise<Comment[]> {
    return this.commentsRepo.findByPost(postId, paginationDto);
  }

  async updateComment(
    id: string, // (comment.id)
    userId: string, // (User.id)
    dto: UpdateCommentDto,
  ): Promise<Comment> {
    const userProfile = await this.profileRepo.findByUserId(userId);
    if (!userProfile) throw new NotFoundException('User Profile not found');

    const comment = await this.commentsRepo.findById(id); // <-- ИЗМЕНЕНО
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.profile.id !== userProfile.id) {
      throw new ForbiddenException('You cannot edit this comment');
    }

    const updated = await this.commentsRepo.updateComment(id, {
      content: dto.content,
    });
    if (!updated) throw new NotFoundException('Comment not found after update');
    return updated;
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const userProfile = await this.profileRepo.findByUserId(userId);
    if (!userProfile) throw new NotFoundException('User Profile not found');

    const comment = await this.commentsRepo.findById(id); // <-- ИЗМЕНЕНО
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.profile.id !== userProfile.id) {
      throw new ForbiddenException('You cannot delete this comment');
    }

    await this.commentsRepo.deleteComment(id);
  }
}
