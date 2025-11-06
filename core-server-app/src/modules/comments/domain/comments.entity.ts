import { Post } from 'src/modules/posts/domain/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from 'src/modules/profiles/domain/profile.entity';
import { CommentLike } from 'src/modules/likes/domain/comment-like.entity'; // ✅ ИМПОРТ

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ✅ ДОБАВЛЕНЫ КОЛОНКИ
  @Column({ type: 'text' })
  content: string; // <-- Вот оно!

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // --- Связи ---
  @ManyToOne(() => Profile, (profile) => profile.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'uuid' })
  profile_id: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'uuid' })
  post_id: string;

  @OneToMany(() => CommentLike, (like) => like.comment)
  likes: CommentLike[];

  // (parent_comment_id пока пропускаем для простоты)
}
