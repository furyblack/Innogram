import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Profile } from 'src/modules/profiles/domain/profile.entity';
import { Post } from 'src/modules/posts/domain/post.entity';

@Entity('posts_likes')
@Unique(['post_id', 'profile_id']) // Уникальная пара
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.postLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'uuid' })
  profile_id: string;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'uuid' })
  post_id: string;
}
