import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../decorators/current-user'; // Убедись, что путь к декоратору верный
import { UpdateUserDto } from '../dto/update-user-dto';

/**
 * Публичный контроллер для получения информации о пользователях.
 * Маршрут: /users
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // ПУБЛИЧНО: Получить список всех пользователей (например, для поиска)
  getAllUsers() {
    return this.usersService.getUsers(); // Метод должен возвращать только публичные данные
  }

  @Get(':id')
  // ПУБЛИЧНО: Получить публичный профиль одного пользователя
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id); // Метод тоже должен возвращать только публичные данные
  }
}

/**
 * Приватный контроллер для управления собственным профилем.
 * Маршрут: /profile
 */
@Controller('profile')
@UseGuards(AuthGuard('jwt')) // ЗАЩИЩЕНО: Все маршруты здесь требуют авторизации
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  // ЗАЩИЩЕНО: Получить детальную информацию о себе
  getMe(@CurrentUser('userId') userId: number) {
    // Здесь можно возвращать больше данных, чем в публичном профиле (например, email)
    return this.usersService.getUserById(userId);
  }

  @Patch('me')
  // ЗАЩИЩЕНО: Обновить свой профиль
  updateMe(@CurrentUser('userId') userId: number, @Body() dto: UpdateUserDto) {
    // Мы используем userId из токена, а не из URL, что гораздо безопаснее
    return this.usersService.updateUser(userId, dto);
  }

  @Delete('me')
  // ЗАЩИЩЕНО: Удалить свой профиль
  deleteMe(@CurrentUser('userId') userId: number) {
    return this.usersService.deleteUser(userId);
  }
}
