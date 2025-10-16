import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from '../application/notification.service';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { User } from 'src/modules/users/domain/user.entity';

@Controller('notifications')
// @UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@CurrentUser() user: User) {
    const userId = user.id;
    return this.notificationsService.getNotificationsForUser(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    const userId = user.id;
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: User) {
    const id = user.id;
    return this.notificationsService.markAllAsRead(id);
  }
}
