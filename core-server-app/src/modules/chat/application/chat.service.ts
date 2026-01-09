import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from '../infrastructure/chat.repository';
import { Chat, ChatType } from '../domain/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/modules/messages/domain/messages.entity';
import { ChatParticipant } from '../domain/chat-participant.entity';
import { Profile } from 'src/modules/profiles/domain/profile.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(ChatParticipant)
    private participantRepo: Repository<ChatParticipant>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
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
    // 1. Ищем записи об участии
    const participations = await this.participantRepo.find({
      where: { profileId },
      relations: [
        'chat',
        'chat.participants', // Загружаем ВСЕХ участников чата
        'chat.participants.profile', // Загружаем ПРОФИЛИ участников (нужны для имен)
        'chat.messages', // Историю сообщений
      ],
      order: { joinedAt: 'DESC' },
    });

    // 2. Возвращаем только объекты Чатов, а не объекты Участников
    // Это то, чего ждет твой фронтенд
    return participations.map((p) => p.chat);
  }

  async saveMessage(userId: string, chatId: string, content: string) {
    // 1. Сначала находим ПРОФИЛЬ по UserID
    // У тебя в ProfileEntity есть связь OneToOne с User, или поле userId.
    // Если есть поле userId (как колонка), то ищем так:
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      // ⚠️ Если у тебя в Profile entity поле называется userId (строка), то пиши { userId: userId }
    });

    if (!profile) {
      throw new NotFoundException('Profile not found for this user');
    }

    // 2. Проверяем чат
    const chat = await this.findChatById(chatId);

    // 3. Создаем сообщение с НАСТОЯЩИМ ProfileID
    const newMessage = this.messageRepo.create({
      content,
      chatId: chat.id,
      profileId: profile.id, // 👈 Теперь тут правильный ID профиля
    });

    // 4. Сохраняем
    return this.messageRepo.save(newMessage);
  }
}
