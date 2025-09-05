import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import * as postsService from '../application/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: postsService.PostsService) {}

  @Post()
  create(
    @Body() body: { authorId: string; title: string; content: string },
  ): postsService.Post {
    return this.postsService.createPost(
      body.authorId,
      body.title,
      body.content,
    );
  }

  @Get()
  findAll(): postsService.Post[] {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): postsService.Post {
    return this.postsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ title: string; content: string }>,
  ): postsService.Post {
    return this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.postsService.removePost(id);
    return { message: 'Post deleted' };
  }
}
