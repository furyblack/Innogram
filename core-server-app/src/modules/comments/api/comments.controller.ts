import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from 'src/modules/comments/application/comments.service';
import { CreateCommentDto } from 'src/modules/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/modules/comments/dto/update-comment.dto';
import { CurrentUser } from 'src/modules/users/decorators/current-user';

/**
 * Этот контроллер отвечает за действия, которые происходят
 * В КОНТЕКСТЕ ПОСТА (создание и получение списка).
 * Маршрут: /posts/:postId/comments
 */
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // ЗАЩИЩЕНО: Только авторизованный пользователь может комментировать
  createComment(
    @CurrentUser('userId') userId: number, // Получаем ID пользователя из токена
    @Param('postId', ParseIntPipe) postId: number, // Получаем ID поста из URL
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(postId, userId, dto);
  }

  @Get()
  // ПУБЛИЧНО: Любой может читать комментарии к посту
  getCommentsByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.getCommentsByPost(postId);
  }
}

/**
 * Этот контроллер отвечает за действия, которые касаются
 * КОНКРЕТНОГО КОММЕНТАРИЯ по его ID (обновление и удаление).
 * Маршрут: /comments/:id
 */
@Controller('comments')
export class CommentActionsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // ЗАЩИЩЕНО: Только автор может редактировать
  updateComment(
    @CurrentUser('userId') userId: number, // Получаем ID пользователя из токена
    @Param('id', ParseIntPipe) id: number, // Получаем ID комментария из URL
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // ЗАЩИЩЕНО: Только автор может удалять
  deleteComment(
    @CurrentUser('userId') userId: number, // Получаем ID пользователя из токена
    @Param('id', ParseIntPipe) id: number, // Получаем ID комментария из URL
  ) {
    return this.commentsService.deleteComment(id, userId);
  }
}
