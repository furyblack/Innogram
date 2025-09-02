import { Module, Post } from "@nestjs/common";
import { PostsController } from "./api/posts.controller";
import { PostsService } from "./application/posts.service";
import { PostsRepository } from "./infrastructure/posts.repository";


@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: []
})

export class PostsModule {}