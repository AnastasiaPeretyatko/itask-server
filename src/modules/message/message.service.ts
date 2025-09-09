import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Message } from 'src/models/message.model';
import { Room } from 'src/models/room.model';
import { User } from 'src/models/user.model';

import { ApiException } from 'src/common/exceptions/api.exceptions';

import { MessageCreateDto } from './dto/message.create';

import { RoomService } from '../room/room.service';
// import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    @InjectModel(Room) private roomRepository: typeof Room,
    private readonly roomService: RoomService,
    // private socketGateway: SocketGateway,
  ) {}

  async createMessage(author_id: string, data: MessageCreateDto) {
    const message = await this.messageRepository.create({ ...data, author_id });
    return await this.findByPk(message.id);
  }

  async create(author_id: string, dto: MessageCreateDto) {
    const { content, parent_id = null, ...ids } = dto;
    const room = await this.roomRepository.findOne({ where: { ...ids } });

    // let userIds = [];
    // if(!room.task_id){
    //   userIds = await this.roomService.findUserInRoom(room.id, author_id, room.access);
    // }

    const message = await this.createMessage(author_id, { room_id: room.id, content, parent_id });

    // this.socketGateway.notifyUsers(userIds, 'new-message', message);
    return message;
  }

  async findAll(userId: string, dto: { room_id?: string; task_id?: string }) {
    const [room, created] = await this.roomRepository.findOrCreate({
      where: { ...dto },
      defaults: {
        owner_id: userId,
      },
    });

    if (!room && !created) {
      throw ApiException.badRequest('Комната не найдена');
    }

    return await this.messageRepository.findAll({
      where: { room_id: room.id, parent_id: null },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'email', 'fullName', 'role'],
        },
        {
          model: Message,
          as: 'children',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'email', 'fullName', 'role'],
            },
          ],
        },
        {
          model: Message,
          as: 'parent',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'email', 'fullName', 'role'],
            },
          ],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
  }

  async findByPk(id: string) {
    return await this.messageRepository.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'email', 'fullName', 'role'],
        },
        {
          model: Message,
          as: 'children',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'email', 'fullName', 'role'],
            },
          ],
        },
        {
          model: Message,
          as: 'parent',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'email', 'fullName', 'role'],
            },
          ],
        },
      ],
    });
  }
}
