import { PostLike } from 'src/modules/likes/domain/post-like.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Profile } from 'src/modules/profiles/domain/profile.entity';
import { Comment } from 'src/modules/comments/domain/comments.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ✅ ДОБАВЛЕНЫ КОЛОНКИ ИЗ ТВОЕГО DTO
  @Column({ type: 'varchar', length: 255 }) // Добавлено
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50, default: 'draft' }) // Добавлено
  status: string;

  // ❌ @Column({ default: false })
  // ❌ is_archived: boolean; // Удалено, т.к. есть status

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // --- Связи ---
  @ManyToOne(() => Profile, (profile) => profile.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'uuid' })
  profile_id: string;

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
