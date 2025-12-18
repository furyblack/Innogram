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

  // Твой старый метод
  async findById(id: string): Promise<Chat | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['participants'], // Полезно сразу грузить участников
    });
  }

  // 👇 ДОБАВЛЯЕМ ЭТОТ МЕТОД (Синхронный, создает объект в памяти)
  create(data: DeepPartial<Chat>): Chat {
    return this.repo.create(data);
  }

  // 👇 ДОБАВЛЯЕМ ЭТОТ МЕТОД (Асинхронный, сохраняет в БД)
  async save(chat: Chat): Promise<Chat> {
    return this.repo.save(chat);
  }
}

// Нужно для типизации data
import { DeepPartial } from 'typeorm';
