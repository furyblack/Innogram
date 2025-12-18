import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './domain/chat.entity';
import { ChatRepository } from './infrastructure/chat.repository';
import { ChatService } from './application/chat.service';
import { ChatController } from './api/chat.controller';
import { ChatParticipant } from './domain/chat-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatParticipant])],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
  exports: [ChatRepository],
})
export class ChatsModule {}
