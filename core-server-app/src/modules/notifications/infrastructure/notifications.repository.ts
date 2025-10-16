import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Adjust this import to your actual entity path

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  /**
   * Create and persist a new notification
   * @param payload Partial notification data
   */
  async create(payload: Partial<Notification>): Promise<Notification> {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  /**
   * Return all notifications (consider pagination in real use)
   */
  async findAll(): Promise<Notification[]> {
    return this.repository.find();
  }

  /**
   * Update parts of a notification
   */
  async update(id: string, patch: Partial<Notification>): Promise<void> {
    await this.repository.update(id, patch);
  }

  /**
   * Remove a notification
   */
  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
