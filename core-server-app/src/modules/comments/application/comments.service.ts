import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Comment } from '../domain/comments.entity';
import { User } from 'src/modules/users/domain/user.entity';
import { Post } from 'src/modules/posts/domain/post.entity';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepo: CommentsRepository) {}

  async createComment(
    post: Post,
    user: User,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsRepo.createComment({
      body: dto.body,
      user,
      post,
    });
  }

  async getAllComments(): Promise<Comment[]> {
    return this.commentsRepo.findAll();
  }

  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentsRepo.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return this.commentsRepo.findByPost(postId);
  }

  async updateComment(
    id: number,
    userId: number,
    dto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.getCommentById(id);
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You cannot edit this comment');
    }

    const updated = await this.commentsRepo.updateComment(id, {
      body: dto.body,
    });
    if (!updated) throw new NotFoundException('Comment not found');
    return updated;
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const comment = await this.getCommentById(id);
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You cannot delete this comment');
    }

    const deleted = await this.commentsRepo.deleteComment(id);
    if (!deleted) throw new NotFoundException('Comment not found');
  }
}
