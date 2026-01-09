import { PaginationDto } from 'src/common/pagination.dto';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ProfileRepository } from 'src/modules/profiles/infrastructure/profile.repository';
import { FollowsRepository } from 'src/modules/follows/infrastructure/follows.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly profileRepo: ProfileRepository,
    private readonly followsRepo: FollowsRepository,
  ) {}

  async createPost(userId: string, dto: CreatePostDto) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found for this user');
    }

    return this.postsRepo.createPost(profile.id, dto);
  }

  async findAll(paginationDto: PaginationDto) {
    return this.postsRepo.findAll(paginationDto);
  }

  async findById(id: string) {
    const post = await this.postsRepo.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async updatePost(id: string, userId: string, dto: UpdatePostDto) {
    const post = await this.findById(id);
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    if (post.profile.id !== profile.id) {
      throw new ForbiddenException('You can update only your posts');
    }
    return this.postsRepo.updatePost(id, dto);
  }

  async removePost(id: string, userId: string) {
    const post = await this.findById(id);
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    if (post.profile.id !== profile.id) {
      throw new ForbiddenException('You can delete only your posts');
    }
    return this.postsRepo.removePost(id);
  }

  async getMyPosts(userId: string, paginationDto: PaginationDto) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    return this.postsRepo.findByProfileId(profile.id, paginationDto);
  }

  async getFeed(userId: string, paginationDto: PaginationDto) {
    // 1. Находим СВОЙ профиль, чтобы узнать свой ID и добавить свои посты в ленту
    const myProfile = await this.profileRepo.findByUserId(userId);
    if (!myProfile) return [];

    // 2. Получаем ID профилей, на которые мы подписаны
    const followingIds = await this.followsRepo.getFollowingIds(myProfile.id);

    // 3. Собираем всё вместе: Мой ID + ID друзей
    const targetProfileIds = [myProfile.id, ...followingIds];

    // 4. Ищем посты
    return this.postsRepo.findPostsByProfileIds(
      targetProfileIds,
      paginationDto,
    );
  }

  async getLikedPosts(userId: string, paginationDto: PaginationDto) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    return this.postsRepo.findLikedByProfileId(profile.id, paginationDto);
  }

  async getCommentedPosts(userId: string, paginationDto: PaginationDto) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    return this.postsRepo.findCommentedByProfileId(profile.id, paginationDto);
  }
  async searchPosts(query: string, paginationDto: PaginationDto) {
    return this.postsRepo.searchPosts(query, paginationDto);
  }
}
