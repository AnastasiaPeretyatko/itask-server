import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateCourseDto } from './dto/create-course.dto';
import { ROLE } from 'src/common/enum/role';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { PaginationDto } from 'src/common/validation/pagination';
import { Assignment } from 'src/models/assignment.model';
import { Course } from 'src/models/courses.model';
import { Group } from 'src/models/group.model';
import { Professor } from 'src/models/professor.model';
import { Semester } from 'src/models/semester.model';
import { Student } from 'src/models/student.model';
import { Task } from 'src/models/tasks.model';
import { User } from 'src/models/user.model';
import { UserTask } from 'src/models/user_task.model';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course) private courseRepository: typeof Course,
    @InjectModel(Professor) private professorRepository: typeof Professor,
    @InjectModel(Assignment) private assignmentRepository: typeof Assignment,
    @InjectModel(Student) private studentRepository: typeof Student,
    @InjectModel(User) private userRepository: typeof User,

    // @InjectModel(UserTask) private userTaskRepository: typeof UserTask,
  ) {}

  //? Исправлено
  async findByPk(id: string) {
    return await this.courseRepository.findOne({
      where: { id },
      include: [
        {
          model: Professor,
          as: 'professors',
          through: { as: 'assignment', attributes: [] },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['fullName', 'avatar', 'email'],
            },
          ],
        },
      ],
    });
  }

  //? Done
  async getOne(id: string) {
    return await this.findByPk(id);
  }

  //? Done
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

      await this.assignmentRepository.bulkCreate(assignments);
    }

    return {
      data: await this.findByPk(course.id),
      message: 'Курс успешно создан',
    };
  }

  async update(id: string, dto: CreateCourseDto) {
    const course = await this.findByPk(id);

    if (!course) {
      throw ApiException.notFound('Курс не найден');
    }

    await course.update(dto);
    await course.save();

    return {
      data: await this.findByPk(id),
      message: 'Курс успешно обновлен',
    };
  }

  async delete(id: string) {
    const course = await this.findByPk(id);

    if (!course) {
      throw ApiException.notFound('Курс не найден');
    }

    //TODO нужно проверить кейс, если у assignment есть задачи не вызовет ли это ошибки
    await this.assignmentRepository.destroy({ where: { courseId: id } });
    await course.destroy();

    return { message: 'Курс успешно удален' };
  }

  //TODO создать таску на тему того что теперь можно передавать params
  async getAll(id: string, query: PaginationDto & { groupId?: string, semesterId?: string, courseId?: string }) {
    const user = await this.userRepository.findByPk(id);
    const whereUser = user.role === ROLE.ADMIN ? {} : { id: user.id };

    const { limit = 10, page = 1, search, ...params } = query;
    const { count, rows: data } = await this.courseRepository.findAndCountAll({
      where: {
        name: { [Op.like]: `%${search}%` },
      },
      include: [
        {
          model: Professor,
          as: 'professors',
          required: true,
          through: { as: 'assignment', attributes: [], where: { ...params } },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['fullName', 'avatar', 'email'],
              where: whereUser,
            },
          ],
        },
      ],
      distinct: true,
      limit,
      offset: limit * (page - 1),
    });

    return { data, count };
  }

  async info(id: string) {
    return await this.courseRepository.findByPk(id);
  }

  async getStudentsAndTask(courseId: string, semesterId: string, groupId: string) {
    const result = await this.studentRepository.findAll({
      include: [
        {
          model: Task,
          as: 'tasks',
          through: { as: 'user_task' },
          include: [
            {
              model: Assignment,
              as: 'assignment',
              attributes: [],
              include: [
                {
                  model: Course,
                  as: 'course',
                  where: { id: courseId },
                  attributes: [],
                },
                {
                  model: Group,
                  as: 'group',
                  where: { id: groupId },
                  attributes: [],
                },
                {
                  model: Semester,
                  as: 'semester',
                  where: { id: semesterId },
                  attributes: [],
                },
              ],
            },
          ],

        },

      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
            SELECT COALESCE(SUM("user_task"."grade"), 0)
            FROM "user_task" AS "user_task"
            INNER JOIN "task" AS "task" ON "task"."id" = "user_task"."task_id"
            INNER JOIN "assignment" AS "assignment" ON "assignment"."id" = "task"."assignmentId"
            WHERE
              "user_task"."student_id" = "Student"."id"
              AND "assignment"."courseId" = '${courseId}'
              AND "assignment"."groupId" = '${groupId}'
              AND "assignment"."semesterId" = '${semesterId}'
          )`),
            'totalScore',
          ],
        ] },
    });
    return result;
  }

  //TODO можно попробовать переписать
  async findAllCourseAndCountTask(id: string) {
    const student = await this.studentRepository.findOne({ where: { user_id: id } });

    if (!student) {throw ApiException.notFound('Студент не найден');}

    const userTasks = await this.assignmentRepository.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('tasks.id')), 'taskCount'],
        [
          Sequelize.fn('SUM', Sequelize.col('tasks->userTask.grade')),
          'totalGrade',
        ],
      ],
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name'],
        },
        {
          model: Semester,
          as: 'semester',
          attributes: [],
          order: [['startDate', 'DESC']],
        },
        {
          model: Task,
          attributes: [],
          as: 'tasks',
          include: [
            {
              model: UserTask,
              as: 'userTask',
              where: { student_id: student.id },
              attributes: [],
            },
          ],
        },
      ],
      group: ['course.id', 'course.name'],
      raw: true,
    });
    return userTasks;
  }
}
