import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { Account } from './account.entity';
import { Profile } from './profile.entity';

export enum UserRole {
    USER = 'User',
    ADMIN = 'Admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string; // <-- Добавлен '!'

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole; // <-- Добавлен '!'

    @Column({ default: false })
    disabled!: boolean; // <-- Добавлен '!'

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date; // <-- Добавлен '!'

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date; // <-- Добавлен '!'

    // --- Связи ---
    @OneToMany(() => Account, (account) => account.user)
    accounts!: Account[]; // <-- Добавлен '!'

    @OneToOne(() => Profile, (profile) => profile.user)
    profile!: Profile; // <-- Добавлен '!'
}
