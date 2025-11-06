import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Profile } from 'src/modules/profiles/domain/profile.entity';
import { Chat } from 'src/modules/chat/domain/chat.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid') // <-- ИЗМЕНЕНО
  id: string;

  @Column({ type: 'text' }) // <-- ИЗМЕНЕНО (с 'body')
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ default: false })
  is_edited: boolean;

  @Column({ default: false })
  deleted: boolean;

  // --- Связи (по спецификации) ---
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' }) // <-- ИЗМЕНЕНО
  @JoinColumn({ name: 'profile_id' })
  profile: Profile; // Отправитель

  @Column({ type: 'uuid' })
  profile_id: string;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' }) // <-- ИЗМЕНЕНО
  @JoinColumn({ name: 'chat_id' })
  chat: Chat; // Чат, к которому принадлежит

  @Column({ type: 'uuid' })
  chat_id: string;

  // ❌ СТАРЫЕ СВЯЗИ УДАЛЕНЫ
  // @ManyToOne(() => User, (user) => user.sentMessages)
  // sender: User;
  //
  // @ManyToOne(() => User, (user) => user.receivedMessages)
  // receiver: User;
}
