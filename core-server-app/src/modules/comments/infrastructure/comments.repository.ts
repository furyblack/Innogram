import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../domain/comments.entity';

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

  async findAll(): Promise<Comment[]> {
    return await this.repo.find({
      relations: ['user', 'post'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: number): Promise<Comment | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
  }

  async findByPost(postId: number): Promise<Comment[]> {
    return await this.repo.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async updateComment(
    id: number,
    data: Partial<Comment>,
  ): Promise<Comment | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
