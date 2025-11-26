import { Injectable, NotFoundException } from '@nestjs/common'; // <-- Добавлен NotFound
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { Repository } from 'typeorm';
// ❌ import { User } from 'src/modules/users/domain/user.entity';
import { Profile } from 'src/modules/profiles/domain/profile.entity'; // ✅
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    // ❌ @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>, // ✅
  ) {}

  async createPost(profileId: string, dto: CreatePostDto): Promise<Post> {
    // <-- ТИП ИЗМЕНЕН
    const profile = await this.profileRepo.findOneBy({ id: profileId }); // ✅
    if (!profile) {
      throw new NotFoundException(`Profile with id ${profileId} not found`);
    }

    const newPost = this.postRepo.create({
      ...dto,
      profile, // <-- ИЗМЕНЕНО
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
    // <-- ТИП ИЗМЕНЕН
    return this.postRepo.findOne({
      where: { id },
      relations: ['profile', 'comments'], // <-- 'user' ИЗМЕНЕН на 'profile'
    });
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<Post | null> {
    // <-- ТИП ИЗМЕНЕН
    await this.postRepo.update(id, dto);
    return this.findById(id);
  }

  async removePost(id: string) {
    // <-- ТИП ИЗМЕНЕН
    return this.postRepo.delete(id);
  }
}
