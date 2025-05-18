import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserTaskService } from './user_task.service';
import { UserTask } from 'src/models/user_task.model';

@ApiTags('Задачи')
@Controller('user-task')
export class UserTaskController {
  constructor(private userTaskService: UserTaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post('answer')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(@Body() dto: any) {
    return await this.userTaskService.addAnswer(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<UserTask>) {
    return await this.userTaskService.update(id, dto);
  }
}
