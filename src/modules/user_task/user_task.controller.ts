import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserTaskService } from './user_task.service';
import { UserTask } from 'src/models/user_task.model';

@ApiTags('Задачи')
@Controller('user-task')
export class UserTaskController {
  constructor(private userTaskService: UserTaskService) {}

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<UserTask>) {
    return await this.userTaskService.update(id, dto);
  }
}
