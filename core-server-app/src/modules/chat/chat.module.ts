import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './domain/chat.entity';
import { ChatRepository } from './infrastructure/chat.repository';
import { ChatService } from './application/chat.service';
import { ChatController } from './api/chat.controller';
// import { ProfilesModule } from '../profiles/profile.module'; // Понадобится для проверки участников

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    // ProfilesModule, // Раскомментировать, когда понадобится
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
  exports: [ChatRepository], // Экспортируем репозиторий для MessagesModule
})
export class ChatsModule {}
