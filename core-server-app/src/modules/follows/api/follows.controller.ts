import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { FollowsService } from '../application/follows.service';

@Controller('follows')
@UseGuards(AuthGuard('jwt'))
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get('requests')
  async getMyRequests(@CurrentUser('userId') userId: string) {
    return this.followsService.getMyRequests(userId);
  }

  @Post('requests/:username/accept')
  async acceptRequest(
    @CurrentUser('userId') userId: string,
    @Param('username') followerUsername: string,
  ) {
    return this.followsService.acceptRequest(userId, followerUsername);
  }

  @Post('requests/:username/decline')
  async declineRequest(
    @CurrentUser('userId') userId: string,
    @Param('username') followerUsername: string,
  ) {
    return this.followsService.declineRequest(userId, followerUsername);
  }

  @Get(':username/status')
  async checkStatus(
    @CurrentUser('userId') userId: string,
    @Param('username') username: string,
  ) {
    return this.followsService.getFollowStatus(userId, username);
  }

  @Post(':username')
  async follow(
    @CurrentUser('userId') userId: string,
    @Param('username') username: string,
  ) {
    return this.followsService.followUser(userId, username);
  }

  @Delete(':username')
  async unfollow(
    @CurrentUser('userId') userId: string,
    @Param('username') username: string,
  ) {
    return this.followsService.unfollowUser(userId, username);
  }
}
