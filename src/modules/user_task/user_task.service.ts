import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TasksService } from '../tasks/tasks.service';
import { TaskStatus } from 'src/common/enum/task';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Document } from 'src/models/documents.model';
import { Student } from 'src/models/student.model';
import { UserTask } from 'src/models/user_task.model';

@Injectable()
export class UserTaskService {
  constructor(
    @InjectModel(UserTask) private userTaskRepository: typeof UserTask,
    @InjectModel(Document) private documentRepository: typeof Document,
    @InjectModel(Student) private studentRepository: typeof Student,
    private readonly taskService: TasksService,
  ) {}

  async addAnswer(userId: string, { taskId, documentIds = [], answer }: {taskId: string, documentIds: string[], answer?: string}) {
    const task = await this.taskService.one(taskId);
    if (!task) {
      throw ApiException.badRequest('Задание не найдено');
    }

    const student = await this.studentRepository.findOne({
      where: { user_id: userId },
    });
    const userTask = await this.userTaskRepository.findOne({
      where: {
        task_id: taskId,
        student_id: student.id,
      },
    });

    if(!userTask) {
      throw ApiException.badRequest('Такого ответа не существует');
    }

    const documents = await this.documentRepository.findAll({
      where: { id: { [Op.in]: documentIds } },
    });

    if(answer) {
      await userTask.update({ answer });
    }

    await userTask.$add('documents', documents);
    await userTask.update({ status: TaskStatus.RESOLVED });
    return { message: 'Ответ успешно сохранен' };
  }

  async find (userId: string, taskId: string, studentId?: string) {
    console.log({ taskId });
    const task = await this.taskService.one(taskId);

    let student = null;
    if(studentId){
      student = await this.studentRepository.findOne({
        where: { user_id: userId },
      });
    }
    const userTask = await this.userTaskRepository.findOne({
      where: {
        task_id: task.id,
        student_id: studentId || student.id,
      },
      include: [
        {
          model: Document,
          as: 'documents',
          through: { as: 'document_task' },
        },
      ],
    });

    if(!userTask) {
      throw ApiException.badRequest('Запись не найдена');
    }
    return userTask;
  }

  async update(userId: string, id: string, data: Partial<UserTask>) {
    const { student_id } = data;
    const task = await this.find(userId, id, student_id);

    if(data.grade > 0) {
      data.status = TaskStatus.CLOSED;
    }

    await task.update({ ...data });
    await task.save();

    //TODO возможно следует возвращать ответ
    return { data: await this.find(userId, id, student_id), message: 'Ответ успешно сохранен' };
  }
}
