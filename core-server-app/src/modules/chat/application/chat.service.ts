import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from '../infrastructure/chat.repository';
import { Chat, ChatType } from '../domain/chat.entity';
// import { ProfileRepository } from 'src/modules/profiles/infrastructure/profile.repository'; // Понадобится в будущем

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    // private readonly profileRepo: ProfileRepository,
  ) {}

  /**
   * (Пример) Создает новый чат.
   * В реальной жизни логика будет сложнее (добавить участников и т.д.)
   */
  async createChat(name: string, type: 'group' | 'private'): Promise<Chat> {
    const chatData: Partial<Chat> = { name, type: type as ChatType };
    return this.chatRepo.create(chatData);
  }

  async findChatById(id: string): Promise<Chat> {
    const chat = await this.chatRepo.findById(id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }
}
