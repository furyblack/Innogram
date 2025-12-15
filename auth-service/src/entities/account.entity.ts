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

@Entity('Accounts') // CamelCase стиль таблицы
@Index(['email', 'provider'], { unique: true })
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' }) // unique убрали из Column, оставили в Index
    email!: string;

    @Column({ type: 'varchar' })
    passwordHash!: string; // CamelCase

    @Column({
        type: 'enum',
        enum: AuthProvider,
        default: AuthProvider.LOCAL,
    })
    provider!: AuthProvider;

    // --- Новое поле из требований ---
    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt!: Date;

    // --- Аудит ---
    @Column({ type: 'uuid', nullable: true })
    createdBy!: string;

    @Column({ type: 'uuid', nullable: true })
    updatedBy!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    // --- Связи ---
    @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
    user!: User;

    @Column({ type: 'uuid' })
    userId!: string;
}
