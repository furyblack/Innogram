import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/pagination.dto';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { PostsService } from '../application/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.createPost(userId, dto);
  }

  @Get('liked')
  @UseGuards(AuthGuard('jwt'))
  async getLiked(
    @CurrentUser('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.postsService.getLikedPosts(userId, paginationDto);
  }

  @Get('commented')
  @UseGuards(AuthGuard('jwt'))
  async getCommented(
    @CurrentUser('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.postsService.getCommentedPosts(userId, paginationDto);
  }

  @Get('feed')
  async getFeed(
    @CurrentUser('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.postsService.getFeed(userId, paginationDto);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  async getMyPosts(
    @CurrentUser('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.postsService.getMyPosts(userId, paginationDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.postsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    // <-- ИЗМЕНЕНО
    return this.postsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseUUIDPipe) id: string, // <-- ИЗМЕНЕНО
    @CurrentUser('userId') userId: string, // <-- ТИП ИЗМЕНЕН
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id', ParseUUIDPipe) id: string, // <-- ИЗМЕНЕНО
    @CurrentUser('userId') userId: string, // <-- ТИП ИЗМЕНЕН
  ) {
    return this.postsService.removePost(id, userId);
  }
}
