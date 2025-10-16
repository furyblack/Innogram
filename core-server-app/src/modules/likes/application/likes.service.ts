import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { LikesRepository } from '../infrastructure/likes.repository';
import { PostsRepository } from 'src/modules/posts/infrastructure/posts.repository';
import { UsersRepository } from 'src/modules/users/infrastructure/users.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepo: LikesRepository,
    private readonly postsRepo: PostsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async likePost(userId: number, postId: number) {
    // 1. Проверяем, существуют ли пост и пользователь
    const post = await this.postsRepo.findById(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 2. Проверяем, не лайкнул ли пользователь этот пост ранее
    const existingLike = await this.likesRepo.findOne(userId, postId);
    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }

    // 3. Создаем лайк
    return this.likesRepo.create(user, post);
  }

  async unlikePost(userId: number, postId: number) {
    // 1. Находим лайк, который нужно удалить
    const like = await this.likesRepo.findOne(userId, postId);
    if (!like) {
      throw new NotFoundException('You have not liked this post');
    }

    // 2. Удаляем лайк
    await this.likesRepo.remove(like);

    // Возвращаем сообщение об успехе
    return { message: 'Like successfully removed' };
  }
}
