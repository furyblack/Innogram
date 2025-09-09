import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  createComment(@Body() dto: CreateCommentDto) {
    // ⚡️ Тут тебе нужно будет пробросить userId и postId (например, через декораторы или передав в body)
    return this.commentsService.createComment(
      { id: 1 } as any,
      { id: 1 } as any,
      dto,
    );
  }

  @Get()
  getAllComments() {
    return this.commentsService.getAllComments();
  }

  @Get(':id')
  getComment(@Param('id') id: string) {
    return this.commentsService.getCommentById(+id);
  }

  @Put(':id')
  updateComment(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    // ⚡️ userId нужно будет взять из JWT
    return this.commentsService.updateComment(+id, 1, dto);
  }

  @Delete(':id')
  deleteComment(@Param('id') id: string) {
    // ⚡️ userId тоже из JWT
    return this.commentsService.deleteComment(+id, 1);
  }
}
