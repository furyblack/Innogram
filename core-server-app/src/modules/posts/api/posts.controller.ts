import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as HttpPost,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  async create(
    @CurrentUser('userId') userId: number,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.createPost(userId, dto);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @CurrentUser('userId') userId: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, userId, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @CurrentUser('userId') userId: number) {
    return this.postsService.removePost(id, userId);
  }
}
