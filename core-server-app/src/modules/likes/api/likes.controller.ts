import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { LikesService } from '../application/likes.service';

/**
 * Контроллер для лайков постов.
 * Адресация: /posts/:postId/likes
 */
@Controller('posts/:postId/likes')
@UseGuards(AuthGuard('jwt'))
export class PostLikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async likePost(
    @CurrentUser('userId') userId: string, // <-- ТИП ИЗМЕНЕН
    @Param('postId', ParseUUIDPipe) postId: string, // <-- ИЗМЕНЕНО
  ) {
    return this.likesService.likePost(userId, postId);
  }

  @Delete()
  async unlikePost(
    @CurrentUser('userId') userId: string, // <-- ТИП ИЗМЕНЕН
    @Param('postId', ParseUUIDPipe) postId: string, // <-- ИЗМЕНЕНО
  ) {
    return this.likesService.unlikePost(userId, postId);
  }
}

/**
 * Контроллер для лайков комментариев.
 * Адресация: /comments/:commentId/likes
 */
@Controller('comments/:commentId/likes')
@UseGuards(AuthGuard('jwt'))
export class CommentLikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async likeComment(
    @CurrentUser('userId') userId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.likesService.likeComment(userId, commentId);
  }

  @Delete()
  async unlikeComment(
    @CurrentUser('userId') userId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.likesService.unlikeComment(userId, commentId);
  }
}
