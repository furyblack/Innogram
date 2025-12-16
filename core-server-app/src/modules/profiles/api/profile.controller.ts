import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { ProfileService } from '../application/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  getMe(@CurrentUser('userId') userId: string) {
    return this.profileService.getProfileByUserId(userId);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userId, dto);
  }
}

@Controller('profiles')
export class PublicProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) return [];
    return this.profileService.searchProfiles(query);
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.profileService.getProfileByUsername(username);
  }
}
