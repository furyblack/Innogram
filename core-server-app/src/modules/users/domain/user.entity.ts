import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
// ✅ ПРАВИЛЬНЫЕ ИМПОРТЫ
import { Account } from 'src/modules/accounts/domain/account.entity';
import { Profile } from 'src/modules/profiles/domain/profile.entity';

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ✅ ДОБАВЛЕНЫ КОЛОНКИ ИЗ СПЕЦИФИКАЦИИ
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // (created_by, updated_by пока пропускаем для простоты)

  // --- Связи ---
  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
