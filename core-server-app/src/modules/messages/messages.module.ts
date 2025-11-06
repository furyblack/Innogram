import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './domain/messages.entity';
import { MessagesRepository } from './infrastructure/messages.repository';
import { MessagesService } from './application/messages.service';
import { MessagesController } from './api/messages.controller';
import { ProfilesModule } from '../profiles/profile.module';
import { ChatsModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ProfilesModule, // Импортируем, чтобы получить ProfileRepository
    ChatsModule, // Импортируем, чтобы получить ChatRepository
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
