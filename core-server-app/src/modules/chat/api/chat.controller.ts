import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from '../application/chat.service';

@Controller('chats')
@UseGuards(AuthGuard('jwt')) // Защищаем все роуты чатов
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id')
  async getChatById(@Param('id', ParseUUIDPipe) id: string) {
    // TODO: Добавить проверку, что пользователь является участником этого чата
    return this.chatService.findChatById(id);
  }

  // Это просто пример, в реальности DTO будет сложнее
  @Post()
  async createChat(@Body() body: { name: string; type: 'group' | 'private' }) {
    return this.chatService.createChat(body.name, body.type);
  }
}
