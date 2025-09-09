import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepo: PostsRepository) {}

  async createPost(userId: number, dto: CreatePostDto) {
    return this.postsRepo.createPost(userId, dto);
  }

  async findAll() {
    return this.postsRepo.findAll();
  }

  async findById(id: number) {
    const post = await this.postsRepo.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async updatePost(id: number, userId: number, dto: UpdatePostDto) {
    const post = await this.findById(id);
    if (post.user.id !== userId) {
      throw new ForbiddenException('You can update only your posts');
    }
    return this.postsRepo.updatePost(id, dto);
  }

  async removePost(id: number, userId: number) {
    const post = await this.findById(id);
    if (post.user.id !== userId) {
      throw new ForbiddenException('You can delete only your posts');
    }
    return this.postsRepo.removePost(id);
  }
}
