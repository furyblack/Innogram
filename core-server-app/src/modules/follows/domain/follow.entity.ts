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
@Unique(['followerId', 'followingId']) // Нельзя подписаться на одного человека дважды
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Тот, КТО подписывается (Подписчик)
  @ManyToOne(() => Profile, (profile) => profile.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followerId' })
  follower: Profile;

  @Column({ type: 'uuid' })
  followerId: string;

  // Тот, НА КОГО подписываются (Лидер мнений)
  @ManyToOne(() => Profile, (profile) => profile.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId' })
  following: Profile;

  @Column({ type: 'uuid' })
  followingId: string;

  @CreateDateColumn()
  createdAt: Date;
}
