import { Injectable, NotFoundException } from '@nestjs/common';

export interface Post {
  id: string;
  authorId: string; // id пользователя
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PostsService {
  private posts: Post[] = [];

  // Создать новый пост
  createPost(authorId: string, title: string, content: string): Post {
    const newPost: Post = {
      id: (Math.random() * 1000000).toFixed(0),
      authorId,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  // Получить все посты
  findAll(): Post[] {
    return this.posts;
  }

  // Найти пост по id
  findById(id: string): Post {
    const post = this.posts.find((p) => p.id === id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  // Обновить пост
  updatePost(id: string, data: Partial<Post>): Post {
    const post = this.findById(id);
    Object.assign(post, data);
    post.updatedAt = new Date();
    return post;
  }

  // Удалить пост
  removePost(id: string): void {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('Post not found');
    this.posts.splice(index, 1);
  }
}
