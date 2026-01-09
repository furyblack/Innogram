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
import { Follow } from 'src/modules/follows/domain/follow.entity';
import { ChatParticipant } from 'src/modules/chat/domain/chat-participant.entity';

@Entity('Profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  displayName: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  avatarUrl: string;

  @Column({ default: false })
  deleted: boolean;

  // --- Аудит ---
  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ default: false })
  isPrivate: boolean;

  // --- Связи ---
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  // Обратные связи
  @OneToMany(() => Post, (post) => post.profile)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.profile)
  comments: Comment[];

  @OneToMany(() => PostLike, (like) => like.profile)
  postLikes: PostLike[];

  @OneToMany(() => CommentLike, (like) => like.profile)
  commentLikes: CommentLike[];

  // На кого я подписан
  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  // Кто подписан на меня
  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => ChatParticipant, (participant) => participant.profile)
  participations: ChatParticipant[];
}
