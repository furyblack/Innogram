import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    // OneToMany - НЕ НУЖЕН ЗДЕСЬ
} from 'typeorm';
import { User } from './user.entity';

// ИМПОРТЫ POST, COMMENT, LIKE УДАЛЕНЫ - они здесь не нужны

@Entity('Profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    username!: string;

    @Column({ type: 'varchar', length: 100 })
    displayName!: string;

    @Column({ type: 'date', nullable: true })
    birthday!: Date;

    @Column({ type: 'text', nullable: true })
    bio!: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    avatarUrl!: string;

    // --- Новые поля ---
    @Column({ default: true })
    isPublic!: boolean;

    @Column({ default: false })
    deleted!: boolean;

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
    // Связь с User НУЖНА, чтобы при регистрации привязать профиль к юзеру
    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ type: 'uuid', unique: true })
    userId!: string;
}
