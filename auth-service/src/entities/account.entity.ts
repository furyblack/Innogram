import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
} from 'typeorm';
import { User } from './user.entity';

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    GITHUB = 'github',
}

@Entity('accounts')
@Index(['email', 'provider'], { unique: true })
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string; // <-- Добавлен '!'

    @Column({ type: 'varchar', unique: true })
    email!: string; // <-- Добавлен '!'

    @Column({ type: 'varchar' })
    password_hash!: string; // <-- Добавлен '!'

    @Column({
        type: 'enum',
        enum: AuthProvider,
        default: AuthProvider.LOCAL,
    })
    provider!: AuthProvider; // <-- Добавлен '!'

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date; // <-- Добавлен '!'

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date; // <-- Добавлен '!'

    // Связи
    @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
    user!: User; // <-- Добавлен '!'

    @Column({ type: 'uuid' })
    user_id!: string; // <-- Добавлен '!'
}
