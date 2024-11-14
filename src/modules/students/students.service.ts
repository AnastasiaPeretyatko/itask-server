import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from 'src/models/group.model';
import { Student } from 'src/models/student.model';
import { User } from 'src/models/user.model';
import { CreateStudentDto } from './dto/create-student.dto';
import { GetStudentsDto } from './dto/get-students.dto';
import { Op, Sequelize } from 'sequelize';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { University } from 'src/models/university.model';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student) private studentRepository: typeof Student,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Group) private groupRepository: typeof Group,
    @InjectModel(University) private universityRepository: typeof University,
  ) {}

  async getOne(id: string) {
    const student = await this.studentRepository.findByPk(id, {
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
    });

    if (!student) throw ApiException.notFound('Студент не найден');

    const newStudent = {
      ...student.toJSON(),
      group: { id: student.group.id, groupCode: student.group?.groupCode },
    };

    delete newStudent.group;

    return newStudent;
  }

  async create(user_id: string, dto: CreateStudentDto) {
    const student = await this.studentRepository.create({
      user_id,
      group_id: dto.groupId,
      fullName: dto.fullName,
      tel: dto.tel,
    });

    const studentData = await this.getOne(student.id);
    return {
      data: studentData,
      message: {
        title: 'Студент успешно создан',
        description: '',
      },
    };
  }

  async getAll(query: GetStudentsDto) {
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

    const data = await this.studentRepository.findAll({
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

    const students = data.map((student) => {
      const studentObj = student.toJSON();

      const group = {
        id: studentObj.group.id,
        groupCode: studentObj.group?.groupCode,
      };

      delete studentObj.group;
      return { ...studentObj, group };
    });

    return students;
  }

  async update(id: string, dto: CreateStudentDto) {
    const student = await this.studentRepository.findByPk(id);

    if (!student) throw ApiException.notFound('Студент не найден');

    await student.update(dto);
    await student.save();

    const data = await this.getOne(id);

    return {
      data,
      message: {
        title: 'Студент успешно обновлен',
        description: '',
      },
    };
  }
}
