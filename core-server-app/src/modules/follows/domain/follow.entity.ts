import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { Profile } from 'src/modules/profiles/domain/profile.entity';

@Entity('Follows')
@Unique(['followerId', 'followingId'])
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followerId' })
  follower: Profile;

  @Column({ type: 'uuid' })
  followerId: string;

  @ManyToOne(() => Profile, (profile) => profile.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId' })
  following: Profile;

  @Column({ type: 'uuid' })
  followingId: string;

  @Column({ type: 'varchar', default: 'accepted' })
  status: 'pending' | 'accepted';

  @CreateDateColumn()
  createdAt: Date;
}
