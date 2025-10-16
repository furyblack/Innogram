// --- Свежая версия файла LikesController ---

import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { LikesService } from '../application/likes.service';

/**
 * Контроллер для управления лайками постов.
 * Адресация: /posts/:postId/likes
 */
@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  /**
   * Поставить лайк посту.
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async likePost(
    @CurrentUser('userId') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.likesService.likePost(userId, postId);
  }

  /**
   * Убрать лайк с поста.
   */
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async unlikePost(
    @CurrentUser('userId') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.likesService.unlikePost(userId, postId);
  }
}
