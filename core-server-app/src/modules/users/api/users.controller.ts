import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe, // <-- ИЗМЕНЕНО
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { PaginationDto } from 'src/common/pagination.dto';

/**
 * Публичный контроллер для получения информации о пользователях (служебный).
 * Маршрут: /users
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // (только для админов, например)
  getAllUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.getUsers(paginationDto);
  }

  @Get(':id')
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    // <-- ИЗМЕHEHO
    return this.usersService.getUserById(id);
  }
}

// ❌ ProfileController УДАЛЕН ОТСЮДА И ПЕРЕЕХАЛ В profiles.module.ts
