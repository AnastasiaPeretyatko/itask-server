import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllTaskDto } from './dto/getAll.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Assignment } from 'src/models/assignment.model';
import { Professor } from 'src/models/professor.model';
import { Student } from 'src/models/student.model';
import { Task } from 'src/models/tasks.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private taskRepository: typeof Task,
    @InjectModel(Assignment) private assignmentRepository: typeof Assignment,
    @InjectModel(Student) private studentRepository: typeof Student,
  ) {}

  async one(id: string) {
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
        },
      ],
    });
    return task;
  }

  async create(dto: CreateTaskDto){
    const { assignment, task } = dto;
    const course = await this.assignmentRepository.findOne({
      where: { ...assignment, professorId: task.creatorId },
    });

    if(!course && !assignment.groupId) {
      throw ApiException.badRequest('Запись не найдена');
    }
    const students = await this.studentRepository.findAll({
      where: { group_id: assignment.groupId },
    });

    const newTask = await this.taskRepository.create({ ...task, assignmentId: course.id });

    await newTask.$set('students', students); //Создание записи для студентов в группе

    return {
      data: await this.one(newTask.id),
      message: 'Задача успешно создана',
    };
  }

  async update(dto: Omit<CreateTaskDto, 'assignment'>) {
    const { task } = dto;
    const updateTask = await this.taskRepository.findOne({
      where: { id: task.id },
    });

    if(!updateTask) {
      throw ApiException.badRequest('Запись не найдена');
    }

    await updateTask.update(task);
    await updateTask.save();

    return {
      data: await this.one(task.id),
      message: 'Задача успешно обновлена',
    };
  }

  async all(query: GetAllTaskDto){
    const tasks = await this.taskRepository.findAll({
      include: {
        model: Assignment,
        as: 'assignment',
        where: { ...query },
      },
    });
    return tasks;
  }
}
