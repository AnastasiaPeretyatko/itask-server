import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoomService } from '../room/room.service';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Message } from 'src/models/message.model';
import { Room } from 'src/models/room.model';
import { User } from 'src/models/user.model';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    @InjectModel(Room) private roomRepository: typeof Room,
    private readonly roomService: RoomService,
    private socketGateway: SocketGateway,
  ) {}

  async create(author_id: string, dto: {room_id: string, content: string}) {
    const room = await this.roomRepository.findOne({ where: { id: dto.room_id } });

    if(!room) {
      throw ApiException.badRequest('Комната не найдена');
    }
    const userIds = await this.roomService.findUserInRoom(room.id, author_id, room.access);
    const createMessage = await this.messageRepository.create({ author_id, ...dto, room_id: dto.room_id });
    const message = await this.messageRepository.findOne({
      where: { id: createMessage.id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'email', 'avatar', 'role'],
        },
      ],
    });

    this.socketGateway.notifyUsers(userIds, 'new-message', message);
    return message;
  }

  async findAll(dto: {room_id: string}) {
    const room = await this.roomRepository.findByPk(dto.room_id);
    if (!room) {
      throw ApiException.badRequest('Комната не найдена');
    }
    return await this.messageRepository.findAll({
      where: { room_id: dto.room_id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'email', 'fullName', 'role'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
  }
}
