import { Controller, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { FollowsService } from '../application/follows.service';

@Controller('users/:username/follow') // Красивый URL: /users/miha/follow
@UseGuards(AuthGuard('jwt'))
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  async follow(
    @CurrentUser('userId') userId: string,
    @Param('username') username: string,
  ) {
    return this.followsService.followUser(userId, username);
  }

  @Delete()
  async unfollow(
    @CurrentUser('userId') userId: string,
    @Param('username') username: string,
  ) {
    return this.followsService.unfollowUser(userId, username);
  }
}
