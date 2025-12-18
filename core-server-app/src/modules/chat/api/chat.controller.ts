import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from '../application/chat.service';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { ProfileService } from 'src/modules/profiles/application/profile.service';

@Controller('chats')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly profileService: ProfileService,
  ) {}

  // 1. Создать чат с кем-то
  // POST /api/chats
  // Body: { targetUsername: "peter" }
  @Post()
  async createChat(
    @CurrentUser('userId') userId: string,
    @Body() body: { targetUsername: string },
  ) {
    // Находим мой профиль
    const myProfile = await this.profileService.getProfileByUserId(userId);
    // Находим профиль друга
    const targetProfile = await this.profileService.getProfileByUsername(
      body.targetUsername,
    );

    return this.chatService.createPrivateChat(myProfile.id, targetProfile.id);
  }

  // 2. Получить мои чаты
  // GET /api/chats
  @Get()
  async getMyChats(@CurrentUser('userId') userId: string) {
    const myProfile = await this.profileService.getProfileByUserId(userId);
    return this.chatService.getMyChats(myProfile.id);
  }
}
