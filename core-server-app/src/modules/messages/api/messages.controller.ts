import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/users/decorators/current-user';
import { MessagesService } from '../application/messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * Отправить новое сообщение.
   * DTO содержит { content, chatId }
   */
  @Post()
  sendMessage(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(userId, dto);
  }

  /**
   * Получить все сообщения для конкретного чата.
   */
  @Get('chat/:chatId')
  getMessagesByChat(
    @CurrentUser('userId') userId: string,
    @Param('chatId', ParseUUIDPipe) chatId: string,
  ) {
    return this.messagesService.getMessagesByChat(userId, chatId);
  }

  /**
   * Удалить свое сообщение.
   */
  @Delete(':id')
  deleteMessage(
    @CurrentUser('userId') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.messagesService.deleteMessage(userId, id);
  }
}
