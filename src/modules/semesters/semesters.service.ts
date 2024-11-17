import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Semester } from 'src/models/semester.model';
import { CreateSemestrDto } from './dto/create-semester.dto';
import { Group } from 'src/models/group.model';

@Injectable()
export class SemestrsService {
  constructor(
    @InjectModel(Semester) private semestrsRepository: typeof Semester,
    @InjectModel(Group) private groupRepository: typeof Group,
  ) {}

  async getOne(id: string) {
    const semestr = await this.semestrsRepository.findByPk(id);

    if (!semestr) throw ApiException.notFound('Семестр не найден');

    return semestr;
  }

  async create(dto: CreateSemestrDto) {
    const semestr = await this.semestrsRepository.create(dto);

    const activeGroups = await this.groupRepository.findAll({
      where: { isActive: true },
    });

    await semestr.$add('groups', activeGroups);

    return {
      data: semestr,
      message: {
        title: 'Семестр успешно создан',
        description: '',
      },
    };
  }

  async update(id: string, dto: CreateSemestrDto) {
    const semestr = await this.getOne(id);

    if (!semestr) throw ApiException.notFound('Семестр не найден');

    await semestr.update(dto);
    await semestr.save();

    return {
      data: await this.getOne(id),
      message: {
        title: 'Семестр успешно обновлен',
        description: '',
      },
    };
  }

  async delete(id: string) {
    const semestr = await this.getOne(id);

    if (!semestr) throw ApiException.notFound('Семестр не найден');

    await semestr.destroy();

    return { message: 'Семестр успешно удален' };
  }

  async getAll() {
    const { count, rows: semestrs } =
      await this.semestrsRepository.findAndCountAll();

    if (!semestrs || !semestrs.length)
      throw ApiException.notFound('Семестры не найдены');

    return {
      data: semestrs,
      count,
    };
  }
}
