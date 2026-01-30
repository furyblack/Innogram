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
    @InjectRepository(Chat)
    private readonly chatTypeOrmRepo: Repository<Chat>,
    private readonly chatRepo: ChatRepository,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(ChatParticipant)
    private participantRepo: Repository<ChatParticipant>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

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

  async createPrivateChat(myProfileId: string, targetProfileId: string) {
    const existingChat = await this.chatTypeOrmRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('participants.profile', 'profile')
      .where('chat.type = :type', { type: ChatType.PRIVATE })
      // Проверяем наличие первого участника (меня)
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('p1.chatId')
          .from(ChatParticipant, 'p1')
          .where('p1.profileId = :myId')
          .getQuery();
        return 'chat.id IN ' + subQuery;
      })
      // Проверяем наличие второго участника (его)
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('p2.chatId')
          .from(ChatParticipant, 'p2')
          .where('p2.profileId = :targetId')
          .getQuery();
        return 'chat.id IN ' + subQuery;
      })
      .setParameters({ myId: myProfileId, targetId: targetProfileId })
      .getOne();

    // Если чат найден — возвращаем его, не создавая новый!
    if (existingChat) {
      return existingChat;
    }

    const chat = this.chatRepo.create({
      type: ChatType.PRIVATE,
    });
    await this.chatRepo.save(chat);

    const me = this.participantRepo.create({
      chatId: chat.id,
      profileId: myProfileId,
    });

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
