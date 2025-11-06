import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Profile } from 'src/modules/profiles/domain/profile.entity';
import { Comment } from 'src/modules/comments/domain/comments.entity';

@Entity('comments_likes')
@Unique(['comment_id', 'profile_id']) // Уникальная пара
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.commentLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'uuid' })
  profile_id: string;

  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @Column({ type: 'uuid' })
  comment_id: string;
}
