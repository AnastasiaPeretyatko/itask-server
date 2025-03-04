import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { CourseAssignment } from 'src/models/course_assignment.model';
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
    @InjectModel(CourseAssignment)
    private courseAssignmentRepository: typeof CourseAssignment,
  ) {}

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
              ],
            },
          ],
        },
      ],
    });

    // if (!course) throw ApiException.notFound('Курс не найден');

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
              ],
            },
          ],
        },
      ],
    });

    return { data, count };
  }

  async info(id: string) {
    return await this.courseRepository.findByPk(id);
  }

  async getGroups(id: string) {
    const groups = await this.courseAssignmentRepository.findAll({
      where: { course_id: id },
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

    const groupsId = [...new Set(groups.map((g) => g.groups ? g.groups.id : null)) as unknown as string[]].filter((el) => el !== null);

    if (!groupsId.length) {return;}

    const groupsData = groupsId.map((gId, indx) => {
      const acc = [];
      groups.forEach((data) => {
        const { professors, semesters, groups, id } = data;
        console.log(professors);
        if (data.groups && data.groups.id === gId) {
          console.log({ gId, groups });

          // Инициализация acc[indx], если он еще не существует
          if (!acc[indx]) {
            acc[indx] = {
              id,
              groups,
              professors: [],
              semesters: [],
            };
          }

          // Добавление professors, если они не равны null
          if (professors) {
            acc[indx].professors.push(...(Array.isArray(professors) ? professors : [professors]));
          }

          // Добавление semesters, если они не равны null
          if (semesters) {
            acc[indx].semesters.push(...(Array.isArray(semesters) ? semesters : [semesters]));
          }
        }
      });
      return acc[indx] || { groups: null, professors: [], semesters: [] }; // Возвращаем acc[indx] или объект по умолчанию
    });

    return groupsData;
  }

  async assigningGroupToCourse(group_id: string, course_id: string) {
    const assignment = await this.courseAssignmentRepository.create({
      group_id,
      course_id,
    });

    return assignment;
  }
}
