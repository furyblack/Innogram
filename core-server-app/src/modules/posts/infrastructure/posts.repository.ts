import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/domain/user.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createPost(userId: number, dto: CreatePostDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const newPost = this.postRepo.create({
      ...dto,
      user,
    });

    return this.postRepo.save(newPost);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    return this.postRepo.find({
      relations: ['user', 'comments'],
      skip: skip, // <-- Пропустить N записей
      take: limit, // <-- Взять M записей
      order: { created_at: 'DESC' }, // Сортируем по дате создания
    });
  }

  async findById(id: number) {
    return this.postRepo.findOne({
      where: { id },
      relations: ['user', 'comments'],
    });
  }

  async updatePost(id: number, dto: UpdatePostDto) {
    await this.postRepo.update(id, { ...dto, updated_at: new Date() });
    return this.findById(id);
  }

  async removePost(id: number) {
    return this.postRepo.delete(id);
  }
}
