import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Semester } from 'src/models/semestr.model';
import { CreateSemestrDto } from './dto/create-semestr.dto';

@Injectable()
export class SemestrsService {
  constructor(
    @InjectModel(Semester) private semestrsRepository: typeof Semester,
  ) {}

  async getOne(id: string) {
    const semestr = await this.semestrsRepository.findByPk(id);

    if (!semestr) throw ApiException.notFound('Семестр не найден');

    return semestr;
  }

  async create(dto: CreateSemestrDto) {
    const semestr = await this.semestrsRepository.create(dto);

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
