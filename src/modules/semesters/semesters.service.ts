import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { StudentsService } from '../students/students.service';
import { SemesterDto } from './dto/create-semester.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Assignment } from 'src/models/assignment.model';
import { Group } from 'src/models/group.model';
import { Semester } from 'src/models/semester.model';

@Injectable()
export class SemestrsService {
  constructor(
    @InjectModel(Semester) private semestrsRepository: typeof Semester,
    @InjectModel(Group) private groupRepository: typeof Group,
    @InjectModel(Assignment) private assignmentRepository: typeof Assignment,
    private readonly studentService: StudentsService,
  ) {}

  async getOne(id: string) {
    const semester = await this.semestrsRepository.findByPk(id);
    if (!semester) {throw ApiException.notFound('Семестр не найден');}
    return semester;
  }

  async create(dto: SemesterDto) {
    const semester = await this.semestrsRepository.create(dto);

    return {
      data: semester,
      message: 'Семестр успешно создан',
    };
  }

  async update(id: string, dto: SemesterDto) {
    const semester = await this.getOne(id);

    if (!semester) {throw ApiException.notFound('Семестр не найден');}

    await semester.update(dto);
    await semester.save();

    return {
      data: await this.getOne(id),
      message: 'Семестр успешно обновлен',
    };
  }

  async delete(id: string) {
    const semester = await this.getOne(id);
    if (!semester) {
      throw ApiException.notFound('Семестр не найден');
    }
    await semester.destroy();
    return { message: 'Семестр успешно удален' };
  }

  async getAll() {
    const { count, rows: semesters } =
      await this.semestrsRepository.findAndCountAll();

    if (!semesters || !semesters.length) {
      throw ApiException.notFound('Семестры не найдены');
    }

    return { data: semesters, count };
  }

  async list(search: string) {
    const data = await this.semestrsRepository.findAll({
      where: { name: { [Op.like]:  `%${search.toLowerCase()}%` } },
    });

    return data;
  }

  async getAllByStudent(id: string) {
    const student = await this.studentService.getOne(id);

    if (!student) {throw ApiException.notFound('Студент не найден');}

    return await this.semestrsRepository.findAll({
      attributes: [['name', 'label'], 'id'],
      include: [
        {
          model: Group,
          as: 'groups',
          through: { as: 'assignment' },
          where: { id: student.group_id },
          attributes: [],
        },
      ],
    });
  }

  async currentSemester () {
    const today = new Date();

    return await this.semestrsRepository.findOne({
      where: {
        startDate: { [Op.lte]: today },
        endDate: { [Op.gte]: today },
      },
    });
  }
}
