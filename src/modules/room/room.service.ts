import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { StudentsService } from '../students/students.service';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Assignment } from 'src/models/assignment.model';
import { Message } from 'src/models/message.model';
import { Room } from 'src/models/room.model';
import { Task } from 'src/models/tasks.model';
import { User } from 'src/models/user.model';
import { UserRoom } from 'src/models/user_room.model';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    @InjectModel(Room) private roomRepository: typeof Room,
    @InjectModel(UserRoom) private userRoomRepository: typeof UserRoom,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Task) private taskRepository: typeof Task,
    @InjectModel(Assignment) private assignmentRepository: typeof Assignment,

    private socketGateway: SocketGateway,
    private studentService: StudentsService,
  ) {}

  async findById(author_id: string, id: string) {
    return this.roomRepository.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'filteredUsers',
          through: {
            where: { user_id: author_id },
          },
          required: true, // фильтруем только те комнаты, где этот юзер есть
          attributes: [],
        },
        {
          model: User,
          as: 'users', // получаем всех пользователей в этих комнатах
          attributes: ['id', 'email', 'fullName', 'avatar'],
          where: {
            [Op.not]: { id: author_id },
          },
        },
        {
          model: Message,
          as: 'messages',
          // where: { author_id: { [Op.not]: author_id } },
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      ],
    });
  }

  async create(id: string, dto: { userIds?: string[], title?: string, task_id?: string, access?: string }) {
    const { title = null } = dto;

    if(!dto.userIds) {
      const room = await this.roomRepository.create({
        owner_id: id,
        title,
        task_id: dto.task_id,
        access: dto.access,
      });

      return room;
    }

    const allUserIds = Array.from(new Set([...dto.userIds, id]));

    // Проверка: если это приватная комната только между двумя пользователями
    if (allUserIds.length === 2) {
      // Найти все приватные комнаты, где участвуют оба пользователя
      const existingRooms = await this.roomRepository.findAll({
        where: {
          is_private: true,
        },
        include: [
          {
            model: User,
            as: 'users',
            where: {
              id: {
                [Op.in]: allUserIds,
              },
            },
            through: {
              attributes: [],
            },
          },
        ],
      });

      for (const room of existingRooms) {
        const roomUsers = await room.$get('users');
        const roomUserIds = roomUsers.map((u) => u.id).sort();
        const currentUserIds = allUserIds.slice().sort();

        const isSameUsers =
          roomUserIds.length === currentUserIds.length &&
          roomUserIds.every((id, index) => id === currentUserIds[index]);

        if (isSameUsers) {
          throw ApiException.badRequest('Приватная комната между этими пользователями уже существует');
        }
      }
    }

    // Если не нашли — создаём
    const room = await this.roomRepository.create({
      title,
      owner_id: id,
      is_private: allUserIds.length > 1,
    });

    const users = await this.userRepository.findAll({
      where: { id: { [Op.in]: allUserIds } },
    });

    if (!users) {
      throw ApiException.badRequest('В комнате не найдены пользователи');
    }

    await room.$set('users', users);
    const dataRoom = await this.findById(id, room.id);

    this.socketGateway.notifyUsers( dto.userIds, 'room_created', dataRoom );

    return { data: await this.findById(id, room.id), message: 'Комната успешно создана' };
  }


  async findAll(id: string) {
    return await this.roomRepository.findAll({
      include: [
        {
          model: User,
          as: 'filteredUsers',
          through: {
            where: { user_id: id },
          },
          required: true, // фильтруем только те комнаты, где этот юзер есть
          attributes: [],
        },
        {
          model: User,
          as: 'users', // получаем всех пользователей в этих комнатах
          attributes: ['id', 'email', 'fullName', 'avatar'],
          where: {
            [Op.not]: { id },
          },
        },
        {
          model: Message,
          as: 'messages',
          // where: { author_id: { [Op.not]: id } },
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      ],
    });
  }

  async deleteUserFromRoom(owner_id: string, { roomId, userId }:{roomId: string, userId: string}) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    if(!room){
      throw ApiException.badRequest('Комната не найдена');
    }

    if(room.owner_id !== owner_id) {
      throw ApiException.badRequest('Вы не являетесь владельцем комнаты');
    }

    await this.userRoomRepository.destroy({
      where: {
        room_id: roomId,
        user_id: userId,
      },
    });
    return { message: 'Пользователь успешно удален из комнаты' };
  }

  async deleteRoom(owner_id: string, { roomId }:{roomId: string}) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if(!room){
      throw ApiException.badRequest('Комната не найдена');
    }

    if(!room.is_private && room.owner_id !== owner_id) {
      throw ApiException.badRequest('Вы не являетесь владельцем комнаты');
    }

    const userIds = await this.findUserInRoom(roomId, owner_id);

    await this.userRoomRepository.destroy({
      where: {
        room_id: roomId,
      },
    });

    await room.destroy();

    this.socketGateway.notifyUsers(userIds, 'room_deleted', { roomId, message: 'Личная перписка была удалена' });
    return { message: 'Комната успешно удалена' };
  }

  async findUserInRoom(room_id, user_id, access?: string) {

    if(access){
      const room = await this.roomRepository.findByPk(room_id);
      const task = await this.taskRepository.findByPk(room.task_id);
      if (access === 'all' || access === 'students'){
        const groupId = (await this.assignmentRepository.findByPk(task.assignmentId)).groupId;
        const students = await this.studentService.getAllStudentIdsInGroup(groupId);
        return students.map((s) => s.id);
      }
    }

    const room = await this.roomRepository.findOne({
      where: { id: room_id },
      include: [
        {
          model: User,
          as: 'users',
          where: {
            [Op.not]: { id: user_id },
          },
          attributes: ['id'],
          required: true,
        },
        {
          model: User,
          as: 'filteredUsers',
          through: {
            where: { user_id },
          },
          required: true,
          attributes: [],
        },
      ],
    });

    if(!room) {
      throw ApiException.badRequest('Комната не найдена');
    }

    return room.users.map((user) => user.id);
  }

  async findRoomForTask(author_id: string, data: { task_id: string }) {
    const { task_id } = data;
    return await this.roomRepository.findAll({
      where: { task_id },
    });
  }
}
