import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../domain/notifications.entity';
import { User } from '../../users/domain/user.entity';
import { Post } from '../../posts/domain/post.entity';

// DTO для создания уведомления
export class CreateNotificationDto {
  recipient: User;
  sender: User;
  type: NotificationType;
  post?: Post;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Получает все уведомления для пользователя с помощью Query Builder
   */
  async getNotificationsForUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.sender', 'sender')
      .leftJoinAndSelect('notification.post', 'post')
      .leftJoin('notification.recipient', 'recipient')
      .where('recipient.id = :userId', { userId })
      .orderBy('notification.created_at', 'DESC')
      .getMany();
  }

  /**
   * Создает новое уведомление
   */
  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(dto);
    return this.notificationRepository.save(notification);
  }

  /**
   * Помечает уведомление как прочитанное
   */
  async markAsRead(
    notificationId: number,
    userId: number,
  ): Promise<Notification> {
    const notification = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoin('notification.recipient', 'recipient')
      .where('notification.id = :notificationId', { notificationId })
      .andWhere('recipient.id = :userId', { userId })
      .getOne();

    if (!notification) {
      throw new NotFoundException(
        'Уведомление не найдено или у вас нет доступа',
      );
    }

    notification.is_read = true;
    return this.notificationRepository.save(notification);
  }

  /**
   * Помечает все уведомления пользователя как прочитанные
   */
  async markAllAsRead(userId: number): Promise<{ updated: number }> {
    // TypeORM автоматически создает колонку recipientId для связи
    // Мы можем использовать ее в `update` запросе
    const result = await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ is_read: true })
      .where('"recipientId" = :userId', { userId })
      .andWhere('is_read = :isRead', { isRead: false })
      .execute();

    return { updated: result.affected || 0 };
  }
}
