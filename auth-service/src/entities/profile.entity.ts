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

@Entity('Profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user!: User;

    @Column({ type: 'uuid', unique: true })
    userId!: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    userName!: string;

    @Column({ type: 'varchar', length: 100 })
    displayName!: string;

    @Column({ type: 'date' })
    birthday!: Date;

    @Column({ type: 'text', nullable: true })
    bio!: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    avatarUrl!: string;

    @Column({ default: true })
    isPublic!: boolean;

    @Column({ default: false })
    deleted!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
