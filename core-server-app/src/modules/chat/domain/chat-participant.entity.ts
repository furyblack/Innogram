import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { Profile } from 'src/modules/profiles/domain/profile.entity'; // Проверь путь

@Entity('ChatParticipants')
export class ChatParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Связь с Чатом
  @ManyToOne(() => Chat, (chat) => chat.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column({ type: 'uuid' })
  chatId: string;

  // Связь с Профилем (Участник)
  @ManyToOne(() => Profile, (profile) => profile.participations)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column({ type: 'uuid' })
  profileId: string;

  // Роль в чате (не путать с ролью юзера в системе)
  @Column({ default: false })
  isAdmin: boolean;

  // Когда добавился
  @CreateDateColumn()
  joinedAt: Date;
}
