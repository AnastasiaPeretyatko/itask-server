import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { UserTask } from 'src/models/user_task.model';

@Injectable()
export class UserTaskService {
  constructor(
    @InjectModel(UserTask) private userTaskRepository: typeof UserTask,
  ) {}

  async find (id: string) {
    const task = await this.userTaskRepository.findByPk(id);

    if(!task) {
      throw ApiException.badRequest('Запись не найдена');
    }
    return task;
  }

  async update(id: string, data: Partial<UserTask>) {
    const task = await this.find(id);

    await task.update({ ...data });
    await task.save();

    //TODO возможно следует возвращать ответ
    return { message: 'Ответ успешно сохранен' };
  }
}
