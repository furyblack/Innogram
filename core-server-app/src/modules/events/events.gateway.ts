import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*', // В продакшене тут будет URL фронта
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
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized! 🚀');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      // 1. Достаем токен из заголовков (Authorization) или Handshake auth
      // Обычно шлют так: { auth: { token: "..." } } или header Authorization: Bearer ...
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization;

      if (!token) {
        this.logger.warn(`Client no token: ${client.id}`);
        client.disconnect();
        return;
      }

      // Чистим "Bearer " если он есть
      const jwt = token.replace('Bearer ', '');

      // 2. Проверяем токен
      const secret =
        this.configService.get<string>('JWT_ACCESS_SECRET') || 'access_secret';
      const payload = this.jwtService.verify(jwt, { secret });

      // 3. Записываем юзера ВНУТРЬ сокета
      // Теперь мы всегда можем сделать client.data.userId и узнать кто это
      client.data.userId = payload.userId; // Убедись, что в токене поле называется userId (или sub)

      this.logger.log(
        `✅ Client connected: ${client.id} (User: ${payload.userId})`,
      );

      // Тут можно сразу добавить юзера в его личную комнату
      // client.join(`user_${payload.userId}`);
    } catch (e) {
      this.logger.error(`❌ Connection rejected: ${e.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
