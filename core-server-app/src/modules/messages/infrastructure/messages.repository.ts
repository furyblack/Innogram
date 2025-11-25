import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../domain/messages.entity';
import { Profile } from 'src/modules/profiles/domain/profile.entity';
import { Chat } from 'src/modules/chat/domain/chat.entity';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
  ) {}

  /**
   * Создает новое сообщение.
   */
  async create(
    profile: Profile,
    chat: Chat,
    content: string,
  ): Promise<Message> {
    const message = this.repo.create({
      profile,
      chat,
      content,
    });
    return this.repo.save(message);
  }

  /**
   * Находит сообщения в конкретном чате (с пагинацией).
   */
  async findByChatId(
    chatId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<Message[]> {
    const skip = (page - 1) * limit;
    return this.repo.find({
      where: { chatId: chatId },
      relations: ['profile'], // Показываем, кто отправил
      order: { createdAt: 'DESC' }, // Новые внизу
      skip,
      take: limit,
    });
  }

  async findById(id: string): Promise<Message | null> {
    return this.repo.findOneBy({ id });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return !!result.affected;
  }
}
