import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from 'src/models/tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { SemesterGroupCourse } from 'src/models/semester-group-course.model';
import { SemesterGroup } from 'src/models/semester-group.model';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Semester } from 'src/models/semester.model';
import { Op } from 'sequelize';
import { Professor } from 'src/models/professor.model';
import { Student } from 'src/models/student.model';
import { group } from 'console';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private taskRepository: typeof Task,
    @InjectModel(SemesterGroupCourse)
    private semesterGroupCourseRepository: typeof SemesterGroupCourse,
    @InjectModel(Professor) private professorRepository: typeof Professor,
    @InjectModel(Student) private studentRepository: typeof Student,
  ) {}

  async getOne(id: string) {
    const task = await this.taskRepository.findByPk(id, {
      include: [
        {
          model: SemesterGroupCourse,
          as: 'semesterGroupCourse',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'course_id',
              'semester_group_id',
            ],
          },
          include: [
            {
              model: SemesterGroup,
              as: 'semesterGroup',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              include: [
                {
                  model: Semester,
                  as: 'semester',
                  attributes: ['id', 'name', 'startDate', 'endDate'],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!task) throw ApiException.notFound('Задача не найдена');
    return task;
  }

  async createTask(dto: CreateTaskDto) {
    const semesterGroupCourseId =
      await this.semesterGroupCourseRepository.findOne({
        where: { courseId: dto.courseId },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'course_id', 'semester_group_id'],
        },
        include: [
          {
            model: SemesterGroup,
            as: 'semesterGroup',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { groupId: dto.groupId },
            include: [
              {
                model: Semester,
                as: 'semester',
                attributes: ['id', 'name', 'startDate', 'endDate'],
                where: {
                  startDate: { [Op.lte]: new Date() },
                  endDate: { [Op.gte]: new Date() },
                },
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

    if (!semesterGroupCourseId)
      throw ApiException.notFound('Предмет не найден');
    const professor = await this.professorRepository.findByPk(dto.creatorId);

    if (!professor) throw ApiException.notFound('Преподаватель не найден');

    if (dto.fromStudentId && !dto.groupId) {
      const student = await this.studentRepository.findByPk(dto.fromStudentId);

      if (!student) throw ApiException.notFound('Студент не найден');
    }

    const { courseId, groupId, ...taskCreate } = dto;

    const task = await this.taskRepository.create({
      ...taskCreate,
      semesterGroupCourseId: semesterGroupCourseId.id,
    });

    //TODO добавить создание задач для студента
    // if(!dto.groupId && dto.fromStudentId){}

    return {
      data: await this.getOne(task.id),
      message: {
        title: 'Задача успешно создана',
        description: '',
      },
    };
  }

  async update(id: string, dto: CreateTaskDto) {
    const task = await this.getOne(id);

    if (!task) throw ApiException.notFound('Задача не найдена');

    await task.update(dto);
    await task.save();

    return {
      data: await this.getOne(id),
      message: {
        title: 'Задача успешно обновлена',
        description: '',
      },
    };
  }

  async delete(id: string) {
    const task = await this.getOne(id);

    if (!task) throw ApiException.notFound('Задача не найдена');

    await task.destroy(); // Удаляем задачу из БД

    return { message: 'Задача успешно удалена' };
  }

  async getAll(groupId: string) {
    const tasks = await this.taskRepository.findAll({
      include: [
        {
          model: SemesterGroupCourse,
          as: 'semesterGroupCourse',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'course_id',
              'semester_group_id',
            ],
          },
          include: [
            {
              model: SemesterGroup,
              as: 'semesterGroup',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              where: { groupId },
              include: [
                {
                  model: Semester,
                  as: 'semester',
                  attributes: ['id', 'name', 'startDate', 'endDate'],
                },
              ],
            },
          ],
        },
      ],
    });
    return tasks;
  }
}
