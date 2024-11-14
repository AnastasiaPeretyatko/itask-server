import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from 'src/models/courses.model';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course) private courseRepository: typeof Course) {}

  async getOne(id: string) {
    const course = await this.courseRepository.findByPk(id);

    if (!course) throw ApiException.notFound('Курс не найден');

    return course;
  }
  async create(dto: CreateCourseDto) {
    const course = await this.courseRepository.create(dto);

    return {
      data: course,
      message: {
        title: 'Курс успешно создан',
        description: '',
      },
    };
  }

  async update(id: string, dto: CreateCourseDto) {
    const course = await this.getOne(id);

    if (!course) throw ApiException.notFound('Курс не найден');

    await course.update(dto);
    await course.save();

    return this.getOne(id);
  }

  async delete(id: string) {
    const course = await this.getOne(id);

    if (!course) throw ApiException.notFound('Курс не найден');

    await course.destroy();

    return { message: 'Курс успешно удален' };
  }

  async getAll() {
    const { count, rows: data } = await this.courseRepository.findAndCountAll();

    if (!data || !data.length) throw ApiException.notFound('Курсы не найдены');

    return {
      data,
      count,
    };
  }
}
