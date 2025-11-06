import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  GITHUB = 'github',
}

@Entity('accounts')
@Index(['email', 'provider'], { unique: true }) //уникальный мейл для провайдера
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Связи
  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'uuid' }) // явный FK
  user_id: string;
}
