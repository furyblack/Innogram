import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    GITHUB = 'github',
}

@Entity('Accounts')
@Index(['email', 'provider'], { unique: true })
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar' })
    passwordHash!: string;

    @Column({
        type: 'enum',
        enum: AuthProvider,
        default: AuthProvider.LOCAL,
    })
    provider!: AuthProvider;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    // Связи
    @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
    @JoinColumn()//
    user!: User;

    @Column({ type: 'uuid' })
    userId!: string;
}
