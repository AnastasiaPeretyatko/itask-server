import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { PaginationDto } from 'src/common/validation/pagination';
import { Assignment } from 'src/models/assignment.model';
import { Course } from 'src/models/courses.model';
import { Group } from 'src/models/group.model';
import { Professor } from 'src/models/professor.model';
import { Semester } from 'src/models/semester.model';
import { University } from 'src/models/university.model';
import { User } from 'src/models/user.model';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course) private courseRepository: typeof Course,
    @InjectModel(Professor) private professorRepository: typeof Professor,
    @InjectModel(Assignment)
    private courseAssignmentRepository: typeof Assignment,
  ) {}

  async getOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      include: [
        {
          model: Assignment,
          as: 'assignment',
          include: [
            {
              model: Professor,
              as: 'professor',
              include: [
                {
                  model: User,
                  as: 'user',
                },
              ],
            },
          ],
        },
      ],
    });

    return course ? course.toJSON() : null;
  }

  async create(dto: CreateCourseDto) {
    const { name, description, professorIds } = dto;

    const course = await this.courseRepository.create({ name, description });

    if (dto.professorIds) {
      const teachers = await this.professorRepository.findAll({
        where: { id: { [Op.in]: professorIds } },
      });

      if (!teachers || teachers.length !== professorIds.length)
      {throw ApiException.badRequest('Преподаватели не найдены');}

      const assignments = teachers.map((teacher) => ({
        professor_id: teacher.id,
        course_id: course.id,
        group_id: null,
        semester_id: null,
      }));

      await this.courseAssignmentRepository.bulkCreate(assignments);
    }

    const data = await this.getOne(course.id);

    return { data, message: 'Курс успешно создан' };
  }

  async update(id: string, dto: CreateCourseDto) {
    const course = await this.getOne(id);

    if (!course) {throw ApiException.notFound('Курс не найден');}

    await course.update(dto);
    await course.save();

    return {
      data: await this.getOne(id),
      message: 'Курс успешно обновлен',
    };
  }

  async delete(id: string) {
    const course = await this.getOne(id);

    if (!course) {throw ApiException.notFound('Курс не найден');}

    const assignments = await this.courseAssignmentRepository.findAll({
      where: { courseId: id },
    });

    await course.destroy();
    assignments.map(async (assignment) => await assignment.destroy());

    return { message: 'Курс успешно удален' };
  }

  async getAll(query: PaginationDto) {
    const { limit = 10, page = 1, search } = query;
    const { count, rows: data } = await this.courseRepository.findAndCountAll({
      where: {
        name: { [Op.like]: `%${search}%` },
      },
      include: [
        {
          model: Assignment,
          as: 'assignments',
          include: [
            {
              model: Professor,
              as: 'professor',
              include: [
                {
                  model: User,
                  as: 'user',
                },
              ],
            },
          ],
        },
      ],
      limit,
      offset: limit * (page - 1),
    });

    return { data, count };
  }

  async info(id: string) {
    return await this.courseRepository.findByPk(id);
  }

  async getGroups(id: string) {
    const groups = await this.courseAssignmentRepository.findAll({
      where: { courseId: id },
      attributes: ['id'],
      include: [
        {
          model: Professor,
          as: 'professors',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
        {
          model: Group,
          as: 'groups',
          include: [
            {
              model: University,
              as: 'university',
            },
          ],
        },
        {
          model: Semester,
          as: 'semesters',
        },
      ],
    });

    const groupsId = [...new Set(groups.map((g) => g.group ? g.group.id : null)) as unknown as string[]].filter((el) => el !== null);

    if (!groupsId.length) {return;}

    const groupsData = groupsId.map((gId, indx) => {
      const acc = [];
      groups.forEach((data) => {
        const { professor, semester, group, id } = data;
        if (data.group && data.group.id === gId) {
          console.log({ gId, groups });

          // Инициализация acc[indx], если он еще не существует
          if (!acc[indx]) {
            acc[indx] = {
              id,
              group,
              professors: [],
              semesters: [],
            };
          }

          // Добавление professors, если они не равны null
          if (professor) {
            acc[indx].professors.push(...(Array.isArray(professor) ? professor : [professor]));
          }

          // Добавление semesters, если они не равны null
          if (semester) {
            acc[indx].semesters.push(...(Array.isArray(semester) ? semester : [semester]));
          }
        }
      });
      return acc[indx] || { groups: null, professors: [], semesters: [] }; // Возвращаем acc[indx] или объект по умолчанию
    });

    return groupsData;
  }

  async assigningGroupToCourse(group_id: string, course_id: string) {
    const assignment = await this.courseAssignmentRepository.create({
      groupId: group_id,
      courseId: course_id,
    });

    return assignment;
  }
}
