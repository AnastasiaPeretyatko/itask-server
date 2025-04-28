import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { StudentDto } from './dto/create-student.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { PaginationDto } from 'src/common/validation/pagination';
import { Group } from 'src/models/group.model';
import { Student } from 'src/models/student.model';
import { University } from 'src/models/university.model';
import { User } from 'src/models/user.model';

@Injectable()
export class StudentsService {
  constructor(@InjectModel(Student) private studentRepository: typeof Student) {}

  async getOne(id: string) {
    const student = await this.studentRepository.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
        {
          model: Group,
          as: 'group',
          include: [
            {
              model: University,
              as: 'university',
            },
          ],
        },
      ],
    });

    if (!student) {throw ApiException.notFound('Студент не найден');}

    const newStudent = {
      ...{ group_id: student.group_id, fullName: student.fullName, tel: student.tel },
      group: { id: student.group.id, groupCode: student.group?.groupCode },
    };

    return newStudent;
  }

  async create(user_id: string, dto: StudentDto) {
    const student = await this.studentRepository.create({
      user_id,
      group_id: dto.groupId,
      fullName: dto.fullName,
      tel: dto.tel,
    });

    const data = await this.getOne(student.id);
    return { data, message: 'Студент успешно создан' };
  }

  async getAll(query: PaginationDto) {
    const { limit = 10, page = 1, search } = query;
    const whereConditions = search
      ? {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('fullName')), {
            [Op.like]: `%${search.toLowerCase()}%`,
          }),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('user.email')),
            {
              [Op.like]: `%${search.toLowerCase()}%`,
            },
          ),
        ],
      }
      : {};

    const { rows, count } = await this.studentRepository.findAndCountAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'user_id', 'group_id'],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
        {
          model: Group,
          as: 'group',
          include: [
            {
              model: University,
              as: 'university',
            },
          ],
        },
      ],
      limit,
      offset: limit * (page - 1),
      where: whereConditions,
    });

    const data = rows.map((student) => {
      const studentObj = student.toJSON();

      const group = {
        id: studentObj.group.id,
        groupCode: studentObj.group?.groupCode,
      };

      delete studentObj.group;
      return { ...studentObj, group };
    });

    return { data, count };
  }

  async update(id: string, dto: StudentDto) {
    const student = await this.studentRepository.findByPk(id);

    if (!student) {throw ApiException.notFound('Студент не найден');}

    await student.update(dto);
    await student.save();

    const data = await this.getOne(id);

    return { data, message: 'Студент успешно обновлен' };
  }

  async getId(userId: string) {
    const student = await this.studentRepository.findOne({
      where: { user_id: userId },
      attributes: ['id', 'fullName', 'group_id'],
    });
    return { studentId: student?.id, ...student?.dataValues };
  }

  async getAllStudentIdsInGroup (group_id: string) {
    return await this.studentRepository.findAll({
      where: { group_id },
      attributes: ['id'],
    });
  }
}
