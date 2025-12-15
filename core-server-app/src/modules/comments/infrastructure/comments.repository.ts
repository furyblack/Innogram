import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../domain/comments.entity';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  async createComment(data: Partial<Comment>): Promise<Comment> {
    const comment = this.repo.create(data);
    return await this.repo.save(comment);
  }

  async findById(id: string): Promise<Comment | null> {
    // <-- ТИП ИЗМЕНЕН
    return await this.repo.findOne({
      where: { id },
      relations: ['profile', 'post'], // <-- 'user' ИЗМЕНЕН на 'profile'
    });
  }

  async findByPost(
    postId: string, // <-- ТИП ИЗМЕНЕН
    paginationDto: PaginationDto,
  ): Promise<Comment[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return await this.repo.find({
      where: { post: { id: postId } },
      relations: ['profile'], // <-- 'user' ИЗМЕНЕН на 'profile'
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
    });
  }

  async updateComment(
    id: string, // <-- ТИП ИЗМЕНЕН
    data: Partial<Comment>,
  ): Promise<Comment | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async deleteComment(id: string): Promise<boolean> {
    // <-- ТИП ИЗМЕНЕН
    const result = await this.repo.delete(id);
    return !!result.affected;
  }
}
