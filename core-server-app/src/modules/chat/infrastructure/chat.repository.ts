import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../domain/chat.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(Chat)
    private readonly repo: Repository<Chat>,
  ) {}

  async create(data: Partial<Chat>): Promise<Chat> {
    const chat = this.repo.create(data);
    return this.repo.save(chat);
  }

  async findById(id: string): Promise<Chat | null> {
    return this.repo.findOneBy({ id });
  }

  // Сюда можно будет добавить поиск чатов по участнику (profile_id)
}
