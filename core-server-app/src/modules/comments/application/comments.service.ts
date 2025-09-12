import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
// Убираем импорты User и Post, они нам здесь не нужны
import { PostsRepository } from 'src/modules/posts/infrastructure/posts.repository';
import { UsersRepository } from 'src/modules/users/infrastructure/users.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Comment } from '../domain/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepo: CommentsRepository,
    // Подключаем репозитории, чтобы проверять существование поста и юзера
    private readonly postsRepo: PostsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async createComment(
    postId: number,
    userId: number,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    // Сервис сам находит нужные сущности по ID
    const user = await this.usersRepo.findById(userId);
    const post = await this.postsRepo.findById(postId);

    if (!user || !post) {
      throw new NotFoundException('User or Post not found');
    }

    return this.commentsRepo.createComment({
      body: dto.body,
      user,
      post,
    });
  }

  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return this.commentsRepo.findByPost(postId);
  }

  async updateComment(
    id: number,
    userId: number,
    dto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentsRepo.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You cannot edit this comment');
    }

    const updated = await this.commentsRepo.updateComment(id, {
      body: dto.body,
    });
    if (!updated) throw new NotFoundException('Comment not found after update'); // На всякий случай
    return updated;
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const comment = await this.commentsRepo.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You cannot delete this comment');
    }

    await this.commentsRepo.deleteComment(id);
  }
}
