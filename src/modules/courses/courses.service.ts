import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { PaginationDto } from 'src/common/validation/pagination';
import { Assignment } from 'src/models/assignment.model';
import { Course } from 'src/models/courses.model';
import { Group } from 'src/models/group.model';
import { Professor } from 'src/models/professor.model';
import { Semester } from 'src/models/semester.model';
import { Student } from 'src/models/student.model';
import { Task } from 'src/models/tasks.model';
import { University } from 'src/models/university.model';
import { User } from 'src/models/user.model';
import { UserTask } from 'src/models/user_task.model';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course) private courseRepository: typeof Course,
    @InjectModel(Professor) private professorRepository: typeof Professor,
    @InjectModel(Assignment) private assigmentRepository: typeof Assignment,
    @InjectModel(Student) private studentRepository: typeof Student,
    @InjectModel(UserTask) private userTaskRepository: typeof UserTask,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async getAllCourseForStudent(userId: string,query: { semesterId: string, groupId: string }) {
    const group = await this.studentRepository.findOne({ where: { user_id: userId } });

    if (!group) {throw ApiException.notFound('Студент не найден');}

    const assignments = await this.assigmentRepository.findAll({
      attributes: ['courseId'],
      where: { ...query, groupId: group.group_id },
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

  async findAllCourseAndCountTask(id: string) {
    const student = await this.studentRepository.findOne({ where: { user_id: id } });

    if (!student) {throw ApiException.notFound('Студент не найден');}

    const userTasks = await this.assigmentRepository.findAll({
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
