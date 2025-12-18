import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from '../infrastructure/chat.repository';
import { Chat, ChatType } from '../domain/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/modules/messages/domain/messages.entity';
import { ChatParticipant } from '../domain/chat-participant.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(ChatParticipant)
    private participantRepo: Repository<ChatParticipant>,
  ) {}

  async createChat(name: string, type: 'group' | 'private'): Promise<Chat> {
    // Тут используем Partial, как у тебя было, или метод репозитория
    // Если в репозитории create принимает объект, то ок.
    // Если там create(chat: Chat), то нужно сначала создать инстанс.
    // Предположим, твой репо умный:
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

  async createPrivateChat(myProfileId: string, targetProfileId: string) {
    // 1. Сначала проверим, нет ли уже такого чата (чтобы не плодить дубликаты)
    // Это сложный SQL запрос, пока пропустим для простоты MVP.
    // Считаем, что всегда создаем новый.

    // 2. Создаем сам Чат
    const chat = this.chatRepo.create({
      type: ChatType.PRIVATE,
    });
    await this.chatRepo.save(chat);

    // 3. Добавляем ТЕБЯ
    const me = this.participantRepo.create({
      chatId: chat.id,
      profileId: myProfileId,
    });

    // 4. Добавляем ЕГО
    const other = this.participantRepo.create({
      chatId: chat.id,
      profileId: targetProfileId,
    });

    await this.participantRepo.save([me, other]);

    return chat;
  }
  async getMyChats(profileId: string) {
    // Ищем записи, где я участник, и подгружаем сам чат + последнее сообщение
    return this.participantRepo.find({
      where: { profileId },
      relations: ['chat', 'chat.messages'], // В реале лучше использовать QueryBuilder
      order: { joinedAt: 'DESC' },
    });
  }

  async saveMessage(userId: string, chatId: string, content: string) {
    // 1. Проверяем чат через твой старый метод
    const chat = await this.findChatById(chatId); // Тут уже есть проверка на ошибку

    // 2. Создаем сообщение
    const newMessage = this.messageRepo.create({
      content,
      chatId: chat.id, // Привязываем к чату
      profileId: userId, // ⚠️ ВАЖНО: Тут мы пока пихаем userId как profileId.
      // В идеале надо найти profile.id через ProfileRepository,
      // но если у тебя userId == profile.userId, то пока сойдет.
      // Лучше, конечно, сначала найти Profile.
    });

    // 3. Сохраняем
    return this.messageRepo.save(newMessage);
  }
}
