import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { Repository } from 'typeorm';
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
    private readonly profileRepo: Repository<Profile>, // ✅
  ) {}

  async createPost(profileId: string, dto: CreatePostDto): Promise<Post> {
    const profile = await this.profileRepo.findOneBy({ id: profileId }); // ✅
    if (!profile) {
      throw new NotFoundException(`Profile with id ${profileId} not found`);
    }

    const newPost = this.postRepo.create({
      ...dto,
      profile,
    });

    return this.postRepo.save(newPost);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    return this.postRepo.find({
      where: { status: 'published' },
      relations: ['profile', 'comments'],
      skip: skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findByProfileId(profileId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return this.postRepo.find({
      where: { profile: { id: profileId } },
      relations: ['comments'],
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

  async findByAuthorIds(authorIds: string[], paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return this.postRepo.find({
      where: {
        profile: { id: In(authorIds) },
        status: 'published',
      },
      relations: ['profile', 'comments', 'likes'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findLikedByProfileId(profileId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return this.postRepo.find({
      where: {
        likes: { profileId: profileId }, // <--- Магия фильтрации по связи
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
        comments: { profileId: profileId }, // <--- Магия фильтрации по связи
        status: 'published',
      },
      relations: ['profile', 'likes', 'comments'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
}
