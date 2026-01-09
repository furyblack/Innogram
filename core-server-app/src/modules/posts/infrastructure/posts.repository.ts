import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { ILike, Repository } from 'typeorm';
import { Profile } from 'src/modules/profiles/domain/profile.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { In } from 'typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async createPost(profileId: string, dto: CreatePostDto): Promise<Post> {
    const newPost = this.postRepo.create({
      ...dto,
      profile: { id: profileId },
    });

    return this.postRepo.save(newPost);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    return this.postRepo.find({
      where: { status: 'published', profile: { isPrivate: false } },
      relations: ['profile', 'comments', 'likes'],
      skip: skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async searchPosts(query: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return this.postRepo.find({
      where: [
        //ищем в заголовке или контенте
        { title: ILike(`%${query}%`), status: 'published' },
        { content: ILike(`%${query}%`), status: 'published' },
      ],
      relations: ['profile', 'comments', 'likes'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findByProfileId(profileId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return this.postRepo.find({
      where: { profile: { id: profileId } },
      relations: ['comments', 'profile'],
      skip: skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Post | null> {
    return this.postRepo.findOne({
      where: { id },
      relations: ['profile', 'comments'],
    });
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<Post | null> {
    await this.postRepo.update(id, dto);
    return this.findById(id);
  }

  async removePost(id: string) {
    return this.postRepo.delete(id);
  }

  async findLikedByProfileId(profileId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return this.postRepo.find({
      where: {
        likes: { profileId: profileId },
        status: 'published',
      },
      relations: ['profile', 'likes', 'comments'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  // Посты, которые комментировал конкретный профиль
  async findCommentedByProfileId(
    profileId: string,
    paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return this.postRepo.find({
      where: {
        comments: { profileId: profileId },
        status: 'published',
      },
      relations: ['profile', 'likes', 'comments'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findPostsByProfileIds(
    profileIds: string[],
    paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    if (profileIds.length === 0) return [];

    return this.postRepo.find({
      where: {
        profile: { id: In(profileIds) },
        status: 'published',
      },
      relations: ['profile', 'likes', 'comments'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });
  }
}
