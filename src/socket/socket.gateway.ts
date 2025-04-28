import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  private connectedUsers: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(userId, client);

      // Можно отправить подтверждение подключения
      client.emit('connection_success', {
        message: 'WebSocket connection established',
      });
    } else {
      console.warn('Client connected without userId');
      client.disconnect(true); // Отключаем если нет userId
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  notifyUsers(userIds: string[], event: string, data: any) {
    userIds.forEach((userId) => {
      const cleanedUserId = userId.trim();
      const client = this.connectedUsers.get(cleanedUserId);
      if (client) {
        console.log(`Sending to ${userId}:`, data);
        client.emit(event, data);
      } else {
        console.warn(`User ${userId} is not connected`);
      }
    });
  }
}

