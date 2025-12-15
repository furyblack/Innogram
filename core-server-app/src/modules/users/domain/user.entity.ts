import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Account } from 'src/modules/accounts/domain/account.entity';
import { Profile } from 'src/modules/profiles/domain/profile.entity';

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
}

@Entity('Users') // Оставили как ты хотел
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  disabled: boolean;

  // --- Новые поля (Аудит) ---
  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  // --- Таймстампы ---
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // --- Связи ---
  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
