import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/modules/users/domain/user.entity';
import { Post } from 'src/modules/posts/domain/post.entity';
import { Comment } from 'src/modules/comments/domain/comments.entity';
import { PostLike } from 'src/modules/likes/domain/post-like.entity';
import { CommentLike } from 'src/modules/likes/domain/comment-like.entity';

@Entity('Profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  userName: string;

  @Column({ type: 'varchar', length: 100 })
  displayName: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // --- Обратные связи ---
  @OneToMany(() => Post, (post) => post.profile)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.profile)
  comments: Comment[];

  @OneToMany(() => PostLike, (like) => like.profile)
  postLikes: PostLike[];

  @OneToMany(() => CommentLike, (like) => like.profile)
  commentLikes: CommentLike[];
}
