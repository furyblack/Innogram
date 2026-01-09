import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './domain/chat.entity';
import { ChatRepository } from './infrastructure/chat.repository';
import { ChatService } from './application/chat.service';
import { ChatController } from './api/chat.controller';
import { ChatParticipant } from './domain/chat-participant.entity';
import { Message } from '../messages/domain/messages.entity';
import { Profile } from '../profiles/domain/profile.entity';
import { ProfilesModule } from '../profiles/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatParticipant, Message, Profile]),
    ProfilesModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
  exports: [ChatRepository, ChatService],
})
export class ChatsModule {}
