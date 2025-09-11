import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LikesService } from '../application/likes.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/users/decorators/current-user';

@Controller('posts/:postId/likes') // Все операции с лайками будут по этому адресу
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async likePost(
    @CurrentUser('userId') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.likesService.likePost(userId, postId);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async unlikePost(
    @CurrentUser('userId') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.likesService.unlikePost(userId, postId);
  }
}
