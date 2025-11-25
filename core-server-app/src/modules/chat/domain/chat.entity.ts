import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Message } from 'src/modules/messages/domain/messages.entity';

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
}

@Entity('Chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string; // (null для 'private')

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ChatType,
    default: ChatType.PRIVATE,
  })
  type: ChatType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // --- Связи ---
  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  // TODO: @OneToMany(() => ChatParticipant, ...)
}
