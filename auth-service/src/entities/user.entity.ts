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

@Entity('Users')
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
    createdAt!: Date; 

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date; 

    // --- Связи ---
    @OneToMany(() => Account, (account) => account.user)
    accounts!: Account[]; 

    @OneToOne(() => Profile, (profile) => profile.user)
    profile!: Profile; 
}