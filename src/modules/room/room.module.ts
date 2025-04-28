import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { StudentsModule } from '../students/students.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Assignment } from 'src/models/assignment.model';
import { Message } from 'src/models/message.model';
import { Notification } from 'src/models/notification.model';
import { Room } from 'src/models/room.model';
import { Task } from 'src/models/tasks.model';
import { User } from 'src/models/user.model';
import { UserRoom } from 'src/models/user_room.model';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [SequelizeModule.forFeature([Message, User, Notification, UserRoom, Room, User, Assignment, Task]), AuthModule, SocketModule, StudentsModule],
  exports: [RoomService],
})
export class RoomModule {}
