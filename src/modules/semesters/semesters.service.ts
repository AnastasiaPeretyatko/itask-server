import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Semester } from 'src/models/semester.model';
import { CreateSemestrDto } from './dto/create-semester.dto';
import { Group } from 'src/models/group.model';
import { Op } from 'sequelize';

@Injectable()
export class SemestrsService {
  constructor(
    @InjectModel(Semester) private semestrsRepository: typeof Semester,
    @InjectModel(Group) private groupRepository: typeof Group,
  ) {}

  async getOne(id: string) {
    const semester = await this.semestrsRepository.findByPk(id);

    if (!semester) throw ApiException.notFound('Семестр не найден');

    return semester;
  }

  async create(dto: CreateSemestrDto) {
    const semester = await this.semestrsRepository.create(dto);

    const activeGroups = await this.groupRepository.findAll({
      where: { isActive: true },
    });

    await semester.$add('groups', activeGroups);

    return {
      data: semester,
      message: {
        title: 'Семестр успешно создан',
        description: '',
      },
    };
  }

  async update(id: string, dto: CreateSemestrDto) {
    const semester = await this.getOne(id);

    if (!semester) throw ApiException.notFound('Семестр не найден');

    await semester.update(dto);
    await semester.save();

    return {
      data: await this.getOne(id),
      message: {
        title: 'Семестр успешно обновлен',
        description: '',
      },
    };
  }

  async delete(id: string) {
    const semester = await this.getOne(id);

    if (!semester) throw ApiException.notFound('Семестр не найден');

    await semester.destroy();

    return { message: 'Семестр успешно удален' };
  }

  async getAll() {
    const { count, rows: semesters } =
      await this.semestrsRepository.findAndCountAll();

    if (!semesters || !semesters.length)
      throw ApiException.notFound('Семестры не найдены');

    return {
      data: semesters,
      count,
    };
  }

  getAllOnSearch = async (search: string) => {
    const semesters = await this.semestrsRepository.findAll({
      where: {
        name: { [Op.like]: `%${search}%` },
      },
    });

    return semesters.map((el) => ({ id: el.id, name: el.name }));
  };
}
