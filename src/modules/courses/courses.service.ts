import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from 'src/models/courses.model';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { SemesterGroupCourse } from 'src/models/semester-group-course.model';
import { SemesterGroup } from 'src/models/semester-group.model';
import { Group } from 'src/models/group.model';
import { University } from 'src/models/university.model';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course) private courseRepository: typeof Course,
    @InjectModel(SemesterGroupCourse)
    private semesterGroupCourseRepository: typeof SemesterGroupCourse,
  ) {}

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

  getAllFromSemesterGroup = async (semesterId: string, groupId: string) => {
    const courses = await this.semesterGroupCourseRepository.findAll({
      attributes: [],
      include: [
        {
          model: Course,
          as: 'course',
        },
        {
          model: SemesterGroup,
          as: 'semesterGroup',
          attributes: [],
          required: true,
          where: { groupId, semesterId },
        },
      ],
    });

    if (!courses) throw ApiException.notFound('Курсы не найдены');

    return courses;
  };

  // Получение списка курсов у преподавателя
  getAllFromProfessor = async (semesterId: string, professorId: string) => {
    console.log(semesterId);
    const courses = await this.courseRepository.findAll({
      include: [
        {
          model: SemesterGroup,
          as: 'semesterGroups',
          where: { semesterId },
          attributes: [],
          through: {
            attributes: [],
          },
          include: [
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
        },
      ],
    });

    return courses;
  };

  getAllGroupByCourse = async () => {
    const groups = await this.courseRepository.findAll({});
  };
}
