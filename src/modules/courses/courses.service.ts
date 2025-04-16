import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
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
    @InjectModel(Assignment) private assigmentRepository: typeof Assignment,
  ) {}

  async find(id: string) {
    return await this.courseRepository.findOne({
      where: { id },
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
    });
  }

  async getOne(id: string) {
    return await this.find(id);
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

      await this.assigmentRepository.bulkCreate(assignments);
    }

    return {
      data: await this.find(course.id),
      message: 'Курс успешно создан',
    };
  }

  async update(id: string, dto: CreateCourseDto) {
    const course = await this.find(id);

    if (!course) {throw ApiException.notFound('Курс не найден');}

    await course.update(dto);
    await course.save();

    return {
      data: await this.find(id),
      message: 'Курс успешно обновлен',
    };
  }

  async delete(id: string) {
    const course = await this.find(id);

    if (!course) {throw ApiException.notFound('Курс не найден');}

    const assignments = await this.assigmentRepository.findAll({
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
    const groups = await this.assigmentRepository.findAll({
      where: { courseId: id },
      attributes: ['id'],
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
          as: 'semester',
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
    const assignment = await this.assigmentRepository.create({
      groupId: group_id,
      courseId: course_id,
    });

    return assignment;
  }

  async getStudentsAndTask(id: string, semesterId: string, groupId: string, professorId: string) {
    const query = `
      SELECT 
        s.*,
        (
          SELECT json_agg(
            json_build_object(
              'task', to_jsonb(t.*),
              'user_task', to_jsonb(ut.*)
            )
          )
          FROM user_task ut
          JOIN task t ON ut.task_id = t.id
          WHERE ut.student_id = s.id
        ) AS task,
        (
          SELECT COALESCE(SUM(grade), 0)
          FROM user_task
          WHERE student_id = s.id
        ) AS "totalGrade"
      FROM "assignment" a
      JOIN students s ON a."groupId" = s.group_id
      WHERE a."groupId" = :groupId
        AND a."courseId" = :courseId
        AND a."semesterId" = :semesterId
      GROUP BY s.id
    `;

    const result = await this.assigmentRepository.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        courseId: id,
        semesterId,
        groupId,
        // professorId,
      },
    });

    return result;
  }

  async getAllCourseForStudent(query: { semesterId: string, groupId: string }) {
    const assignments = await this.assigmentRepository.findAll({
      attributes: ['courseId'],
      where: { ...query },
      include: [
        {
          model: Course,
          as: 'course',
        },
      ],
    });

    // Извлекаем курсы и убираем дубликаты
    const uniqueCourses = Array.from(
      new Map(assignments.map((item) => [item.course.id, item.course])).values(),
    );

    return uniqueCourses;
  }
}
