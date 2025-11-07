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
    id!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole; 

    @Column({ default: false })
    disabled!: boolean; 

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date; 

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date; 

    // --- Связи ---
    @OneToMany(() => Account, (account) => account.user)
    accounts!: Account[]; 

    @OneToOne(() => Profile, (profile) => profile.user)
    profile!: Profile; 
}