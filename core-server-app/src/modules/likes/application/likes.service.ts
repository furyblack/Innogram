import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PostsRepository } from 'src/modules/posts/infrastructure/posts.repository';
import { ProfileRepository } from 'src/modules/profiles/infrastructure/profile.repository';
import { PostLikeRepository } from '../infrastructure/post-like.repository';
import { CommentLikeRepository } from '../infrastructure/comment-like.repository';
import { CommentsRepository } from 'src/modules/comments/infrastructure/comments.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly postLikeRepo: PostLikeRepository,
    private readonly commentLikeRepo: CommentLikeRepository,
    private readonly profileRepo: ProfileRepository,
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
  ) {}

  // --- ЛАЙКИ ПОСТОВ ---

  async likePost(userId: string, postId: string) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    const post = await this.postsRepo.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.postLikeRepo.findOneByProfileAndPost(
      profile.id,
      postId,
    );
    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }

    return this.postLikeRepo.create(profile, post);
  }

  async unlikePost(userId: string, postId: string) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    const like = await this.postLikeRepo.findOneByProfileAndPost(
      profile.id,
      postId,
    );
    if (!like) {
      throw new NotFoundException('You have not liked this post');
    }

    await this.postLikeRepo.delete(like.id);
    return { message: 'Like successfully removed' };
  }

  // --- ЛАЙКИ КОММЕНТАРИЕВ ---

  async likeComment(userId: string, commentId: string) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    const comment = await this.commentsRepo.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const existingLike = await this.commentLikeRepo.findOneByProfileAndComment(
      profile.id,
      commentId,
    );
    if (existingLike) {
      throw new ConflictException('You have already liked this comment');
    }

    return this.commentLikeRepo.create(profile, comment);
  }

  async unlikeComment(userId: string, commentId: string) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    const like = await this.commentLikeRepo.findOneByProfileAndComment(
      profile.id,
      commentId,
    );
    if (!like) {
      throw new NotFoundException('You have not liked this comment');
    }

    await this.commentLikeRepo.delete(like.id);
    return { message: 'Like successfully removed' };
  }
}
