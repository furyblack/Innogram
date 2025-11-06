import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe, // <-- ИЗМЕНЕНО
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { ProfileService } from '../application/profile.service';
// import { UpdateProfileDto } from '../dto/update-profile.dto'; // TODO

/**
 * Приватный контроллер для управления СОБСТВЕННЫМ профилем.
 * Маршрут: /profile
 */
@Controller('profile')
@UseGuards(AuthGuard('jwt')) // ЗАЩИЩЕНО: Все маршруты здесь требуют авторизации
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  getMe(@CurrentUser('userId') userId: string) {
    // <-- ТИП ИЗМЕНЕН
    // userId из токена (это User.id)
    return this.profileService.getProfileByUserId(userId);
  }

  // @Patch('me')
  // updateMe(
  //   @CurrentUser('userId') userId: string,
  //   @Body() dto: UpdateProfileDto,
  // ) {
  //   return this.profileService.updateProfile(userId, dto);
  // }

  // TODO: @Delete('me')
}

/**
 * Публичный контроллер для просмотра профилей.
 * Маршрут: /users (или /profiles)
 */
@Controller('profiles') // <-- Новый маршрут
export class PublicProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.profileService.getProfileByUsername(username);
  }

  // TODO: @Get() для поиска
}
