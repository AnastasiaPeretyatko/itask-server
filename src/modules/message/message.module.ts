import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { RoomModule } from '../room/room.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from 'src/models/message.model';
import { Notification } from 'src/models/notification.model';
import { Room } from 'src/models/room.model';
import { User } from 'src/models/user.model';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [SequelizeModule.forFeature([Message, User, Notification, Room]), AuthModule, RoomModule, SocketModule],
  exports: [],
})
export class MessageModule {}
