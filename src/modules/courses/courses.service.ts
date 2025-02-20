import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from 'src/models/courses.model';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Professor } from 'src/models/professor.model';
import { CourseAssignment } from 'src/models/course_assignment.model';
import { Op } from 'sequelize';
import { User } from 'src/models/user.model';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course) private courseRepository: typeof Course,
    @InjectModel(Professor) private professorRepository: typeof Professor,
    @InjectModel(CourseAssignment)
    private courseAssignmentRepository: typeof CourseAssignment,
  ) { }

  async getOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      include: [
        {
          model: CourseAssignment,
          as: 'course_assignment',
          include: [
            {
              model: Professor,
              as: 'professors',
              include: [
                {
                  model: User,
                  as: 'user',
                },
              ]
            },
          ],
        },
      ],
    });

    if (!course) throw ApiException.notFound('Курс не найден');

    return course;
  }
  async create(dto: CreateCourseDto) {
    const { name, description, professorIds } = dto;
    console.log({ description });
    // return 'keke'
    const course = await this.courseRepository.create({ name, description });

    if (dto.professorIds) {
      const teachers = await this.professorRepository.findAll({
        where: { id: { [Op.in]: professorIds } },
      });

      if (!teachers || teachers.length !== professorIds.length)
        throw ApiException.badRequest('Преподаватели не найдены');

      const assignments = teachers.map((teacher) => ({
        professor_id: teacher.id,
        course_id: course.id,
        group_id: null,
        semester_id: null,
      }));

      await this.courseAssignmentRepository.bulkCreate(assignments);
    }

    const data = await this.getOne(course.id);

    return {
      ...data,
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

    return {
      data: await this.getOne(id),
      message: {
        title: 'Курс успешно обновлен',
        description: '',
      },
    }
  }

  async delete(id: string) {
    const course = await this.getOne(id);

    if (!course) throw ApiException.notFound('Курс не найден');

    const assignments = await this.courseAssignmentRepository.findAll({
      where: { course_id: id },
    });

    await course.destroy();
    assignments.map(async (assignment) => await assignment.destroy());

    return { message: 'Курс успешно удален' };
  }

  async getAll() {
    const { count, rows: data } = await this.courseRepository.findAndCountAll({
      include: [
        {
          model: CourseAssignment,
          as: 'course_assignment',
          include: [
            {
              model: Professor,
              as: 'professors',
              include: [
                {
                  model: User,
                  as: 'user',
                },
              ]
            },
          ],
        }
      ],
    });

    return { data, count };
  }
}
