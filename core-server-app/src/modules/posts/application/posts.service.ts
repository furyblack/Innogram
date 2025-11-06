import { PaginationDto } from './../../../common/pagination.dto';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ProfileRepository } from 'src/modules/profiles/infrastructure/profile.repository'; // ✅

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly profileRepo: ProfileRepository, // ✅
  ) {}

  async createPost(userId: string, dto: CreatePostDto) {
    // <-- ТИП ИЗМЕНЕН (это User.id)
    // Находим профиль по User ID
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found for this user');
    }
    // Создаем пост, используя ID профиля
    return this.postsRepo.createPost(profile.id, dto);
  }

  async findAll(paginationDto: PaginationDto) {
    return this.postsRepo.findAll(paginationDto);
  }

  async findById(id: string) {
    // <-- ТИП ИЗМЕНЕН
    const post = await this.postsRepo.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async updatePost(id: string, userId: string, dto: UpdatePostDto) {
    // <-- ТИПЫ ИЗМЕНЕНЫ
    const post = await this.findById(id);
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    if (post.profile.id !== profile.id) {
      // <-- ЛОГИКА ИЗМЕНЕНА
      throw new ForbiddenException('You can update only your posts');
    }
    return this.postsRepo.updatePost(id, dto);
  }

  async removePost(id: string, userId: string) {
    // <-- ТИПЫ ИЗМЕНЕНЫ
    const post = await this.findById(id);
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    if (post.profile.id !== profile.id) {
      // <-- ЛОГИКА ИЗМЕНЕНА
      throw new ForbiddenException('You can delete only your posts');
    }
    return this.postsRepo.removePost(id);
  }
}
