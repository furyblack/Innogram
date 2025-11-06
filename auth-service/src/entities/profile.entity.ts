import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id!: string; // <-- Добавлен '!'

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User; // <-- Добавлен '!'

    @Column({ type: 'uuid', unique: true })
    user_id!: string; // <-- Добавлен '!'

    @Column({ type: 'varchar', length: 50, unique: true })
    username!: string; // <-- Добавлен '!'

    @Column({ type: 'varchar', length: 100 })
    display_name!: string; // <-- Добавлен '!'

    @Column({ type: 'date' })
    birthday!: Date; // <-- Добавлен '!'

    @Column({ type: 'text', nullable: true })
    bio!: string; // <-- Добавлен '!'

    @Column({ type: 'varchar', length: 500, nullable: true })
    avatar_url!: string; // <-- Добавлен '!'

    @Column({ default: true })
    is_public!: boolean; // <-- Добавлен '!'

    @Column({ default: false })
    deleted!: boolean; // <-- Добавлен '!'

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date; // <-- Добавлен '!'

    @UpdateDateColumn({ type: 'timestamp' }) // <-- ✅ ОПЕЧАТКА ИСПРАВЛЕНА
    updated_at!: Date; // <-- Добавлен '!'
}
