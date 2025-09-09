/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MessageCreateDto } from 'src/modules/message/dto/message.create';
import { MessageService } from 'src/modules/message/message.service';
import { getCurrentUserById, getRoomUsers, userJoinRoom, userLeaveRoom } from 'src/utils/users';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private messageService: MessageService) {}

  @WebSocketServer()
  wsServer: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log('connection', client.id);

    client.emit('connection_success', {
      message: 'WebSocket connection established',
    });
  }

  async handleDisconnect(client: Socket) {
    const user = userLeaveRoom(client.id);

    if (user) {
      await client.leave(user.roomId);
      client.broadcast.to(user.roomId).emit('status', {
        userId: user.id,
        status: 'offline',
      });
    }
  }

  @SubscribeMessage('chatMessage')
  async handleMessage(client: Socket, data: { message: MessageCreateDto }) {
    const user = getCurrentUserById(client.id);
    const message = await this.messageService.createMessage(client.handshake.query.userId as string, {
      room_id: data.message.room_id,
      content: data.message.content,
    });

    client.broadcast.to(user.roomId).emit('message', { message });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, data: { username: string; roomId: string }) {
    const userId = client.handshake.query.userId as string;
    const user = userJoinRoom({ id: userId, ...data, socketId: client.id });
    await client.join(data.roomId);

    // client.broadcast
    //   .to(data.roomId)
    //   .emit(
    //     'message',
    //     { message: `${user.username} joined the room` },
    //   );

    client.broadcast.to(user.roomId).emit('status', {
      userId,
      status: 'online',
    });

    this.wsServer.to(data.roomId).emit('userRoom', {
      users: getRoomUsers(data.roomId),
      room: data.roomId,
    });
  }

  @SubscribeMessage('typing')
  handleTypingUsers(client: Socket, data: { roomId: string; typing: boolean }) {
    const userId = client.handshake.query.userId as string;

    client.broadcast.to(data.roomId).emit('typing', { userId: [userId], typing: data.typing });
  }
}
