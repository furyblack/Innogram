import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/modules/users/domain/user.entity';
import { Post } from 'src/modules/posts/domain/post.entity';

@Entity({ name: 'likes' }) // Явно указываем имя таблицы
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  // Связь: Многие лайки могут принадлежать одному пользователю
  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  // Связь: Многие лайки могут принадлежать одному посту
  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post: Post;
}
