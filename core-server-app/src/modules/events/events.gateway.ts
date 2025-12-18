import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from '../chat/application/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized! 🚀');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization;
      if (!token) throw new Error('No token');
      const jwt = token.replace('Bearer ', '');
      const secret =
        this.configService.get<string>('JWT_ACCESS_SECRET') || 'access_secret';
      const payload = this.jwtService.verify(jwt, { secret });

      client.data.userId = payload.userId;
      this.logger.log(
        `✅ Client connected: ${client.id} (User: ${payload.userId})`,
      );
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    // Подписываем сокет на комнату
    client.join(data.chatId);
    this.logger.log(`User ${client.data.userId} joined room ${data.chatId}`);
    return { event: 'joined', data: { chatId: data.chatId } };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; content: string },
  ) {
    const userId = client.data.userId;
    this.logger.log(`Msg from ${userId} to ${data.chatId}: ${data.content}`);

    // 1. Сохраняем в БД через сервис
    const savedMessage = await this.chatService.saveMessage(
      userId,
      data.chatId,
      data.content,
    );

    // 2. Рассылаем всем в комнате
    this.server.to(data.chatId).emit('newMessage', savedMessage);
  }
}
