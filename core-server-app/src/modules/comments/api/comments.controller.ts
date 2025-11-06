import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe, // <-- ИЗМЕНЕНО
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/pagination.dto';
import { CommentsService } from 'src/modules/comments/application/comments.service';
import { CreateCommentDto } from 'src/modules/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/modules/comments/dto/update-comment.dto';
import { CurrentUser } from 'src/modules/users/decorators/current-user';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createComment(
    @CurrentUser('userId') userId: string, // <-- ТИП ИЗМЕНЕН
    @Param('postId', ParseUUIDPipe) postId: string, // <-- ИЗМЕНЕНО
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(postId, userId, dto);
  }

  @Get()
  getCommentsByPost(
    @Param('postId', ParseUUIDPipe) postId: string, // <-- ИЗМЕНЕНО
    @Query() paginationDto: PaginationDto,
  ) {
    return this.commentsService.getCommentsByPost(postId, paginationDto);
  }
}

@Controller('comments')
export class CommentActionsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateComment(
    @CurrentUser('userId') userId: string, // <-- ТИП ИЗМЕНЕН
    @Param('id', ParseUUIDPipe) id: string, // <-- ИЗМЕНЕНО
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteComment(
    @CurrentUser('userId') userId: string, // <-- ТИП ИЗМЕНЕН
    @Param('id', ParseUUIDPipe) id: string, // <-- ИЗМЕНЕНО
  ) {
    return this.commentsService.deleteComment(id, userId);
  }
}
