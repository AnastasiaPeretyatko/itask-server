import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { Assignment } from 'src/models/assignment.model';
import { Course } from 'src/models/courses.model';
import { Professor } from 'src/models/professor.model';
import { Student } from 'src/models/student.model';
import { Task } from 'src/models/tasks.model';
import { UserTask } from 'src/models/user_task.model';

import { TaskStatus } from 'src/common/enum/task';
import { ApiException } from 'src/common/exceptions/api.exceptions';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllTaskDto } from './dto/getAll.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private taskRepository: typeof Task,
    @InjectModel(Assignment) private assignmentRepository: typeof Assignment,
    @InjectModel(Student) private studentRepository: typeof Student,
    @InjectModel(UserTask) private userTaskRepository: typeof UserTask,
  ) {}

  async one(id: string, userId?: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
      include: [
        {
          model: Professor,
          as: 'creatorBy',
        },
        {
          model: Student,
          as: 'students',
        },
        {
          model: Assignment,
          as: 'assignment',
          include: [
            {
              model: Course,
              as: 'course',
            },
          ],
        },
      ],
    });

    if (!userId) {
      return task;
    }
    const student = await this.studentRepository.findOne({ where: { user_id: userId } });
    if (!student) {
      return task;
    }

    const isAnswer = await this.userTaskRepository.findOne({
      where: { task_id: id, student_id: student.id },
    });

    if (!isAnswer) {
      task.dataValues.isAnswered = false;
    }

    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    const { assignment, task } = dto;
    const course = await this.assignmentRepository.findOne({
      where: { ...assignment },
    });

    if (!course && !assignment.groupId) {
      throw ApiException.badRequest('Запись не найдена');
    }
    const students = await this.studentRepository.findAll({
      where: { group_id: assignment.groupId },
    });

    const newTask = await this.taskRepository.create({ ...task, assignmentId: course.id });

    await newTask.$set('students', students); //Создание записи для студентов в группе

    return {
      data: await this.one(newTask.id, userId),
      message: 'Задача успешно создана',
    };
  }

  async update(dto: Omit<CreateTaskDto, 'assignment'>) {
    const { task } = dto;
    const updateTask = await this.taskRepository.findOne({
      where: { id: task.id },
    });

    if (!updateTask) {
      throw ApiException.badRequest('Запись не найдена');
    }

    await updateTask.update(task);
    await updateTask.save();

    return {
      data: await this.one(task.id),
      message: 'Задача успешно обновлена',
    };
  }

  async all(query: GetAllTaskDto) {
    const tasks = await this.taskRepository.findAll({
      include: {
        model: Assignment,
        as: 'assignment',
        where: { ...query },
      },
    });
    return tasks;
  }

  async getTasksForStudent(id: string, month?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const taskWhere: any = {};

    if (month) {
      const startOfMonth = new Date(`${month}-01T00:00:00`);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0); // Последний день месяца (28-31)

      // Только задачи, у которых endDate попадает в этот месяц
      taskWhere.endDate = {
        [Op.between]: [startOfMonth, endOfMonth], // BETWEEN начало_месяца AND конец_месяца
      };
    }

    const student = await this.studentRepository.findOne({
      where: { id },
      include: [
        {
          model: Task,
          as: 'tasks',
          through: { as: 'user_task' },
          include: [
            {
              model: Assignment,
              as: 'assignment',
              attributes: ['courseId', 'groupId', 'semesterId'],
              include: [
                {
                  model: Course,
                  as: 'course',
                  attributes: ['name'],
                },
              ],
            },
            {
              model: Professor,
              as: 'creatorBy',
              attributes: ['id', 'fullName'],
            },
          ],
          ...(month && { where: taskWhere }),
          order: [['endDate', 'ASC']], // Сортировка по возрастанию endDate
        },
      ],
    });

    const tasks =
      student?.tasks.map(task => {
        // Создаем новый объект с нужными свойствами
        const { assignment } = task.toJSON();

        return {
          ...task.toJSON(),
          courseName: assignment?.course?.name, // Добавляем courseName перед возвратом
        };
      }) || [];
    return tasks;
  }

  async updateStatusTask(id: string, status: TaskStatus) {
    const task = await this.userTaskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw ApiException.badRequest('Запись не найдена');
    }

    await task.update({ status });

    const { tasks } = await this.studentRepository.findOne({
      include: [
        {
          model: Task,
          as: 'tasks',
          through: { as: 'user_task', where: { id: task.id } },
        },
      ],
    });

    return {
      data: tasks[0],
      message: 'Задача успешно обновлена',
    };
  }
}
