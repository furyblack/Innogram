import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './api/notifications.controller';
import { NotificationsService } from './application/notification.service';
import { UsersModule } from '../users/user.module';
import { PostsModule } from '../posts/post.module';
import { Notification } from './domain/notifications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UsersModule, PostsModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
