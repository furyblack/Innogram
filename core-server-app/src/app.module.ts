import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentsModule } from './modules/comments/comments.module';
import { UsersModule } from './modules/users/user.module';
import { PostsModule } from './modules/posts/post.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './modules/likes/likes.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ProfilesModule } from './modules/profiles/profile.module';
import { ChatsModule } from './modules/chat/chat.module';
import { MessagesModule } from './modules/messages/messages.module';
import { FollowsModule } from './modules/follows/follows.module';
import { AssetsModule } from './modules/assets/assets.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        // Гораздо надежнее указать сущности явно
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true, // <-- NestJS сам найдет все .entity.ts
        synchronize: true, // В production должно быть false
        logging: true,
      }),
    }),
    AuthModule,
    UsersModule,
    AccountsModule,
    ProfilesModule,
    PostsModule,
    LikesModule,
    CommentsModule,
    ChatsModule,
    MessagesModule,
    FollowsModule,
    AssetsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
