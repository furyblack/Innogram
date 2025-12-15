import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { MessagesRepository } from '../infrastructure/messages.repository';
import { ProfileRepository } from 'src/modules/profiles/infrastructure/profile.repository';
import { CreateMessageDto } from '../dto/create-message.dto';
import { ChatRepository } from 'src/modules/chat/infrastructure/chat.repository';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepo: MessagesRepository,
    private readonly profileRepo: ProfileRepository,
    private readonly chatRepo: ChatRepository,
  ) {}

  /**
   * Отправляет сообщение в чат от имени пользователя.
   */
  async sendMessage(userId: string, dto: CreateMessageDto) {
    // 1. Найти профиль отправителя
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // 2. Найти чат
    const chat = await this.chatRepo.findById(dto.chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // TODO: 3. Проверить, является ли профиль участником этого чата
    // (Эта логика появится, когда у нас будет сущность ChatParticipant)

    // 4. Создать сообщение
    return this.messagesRepo.create(profile, chat, dto.content);
  }

  /**
   * Получает все сообщения из чата.
   */
  async getMessagesByChat(userId: string, chatId: string) {
    // 1. Найти профиль
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // TODO: 2. Проверить, является ли профиль участником этого чата

    // 3. Получить сообщения
    return this.messagesRepo.findByChatId(chatId);
  }

  /**
   * Удаляет сообщение (только автор).
   */
  async deleteMessage(userId: string, messageId: string) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const message = await this.messagesRepo.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.profileId !== profile.id) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.messagesRepo.delete(messageId);
    return { message: 'Message deleted' };
  }
}
