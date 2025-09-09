import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserTask } from 'src/models/user_task.model';

import { UserTaskService } from './user_task.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Задачи')
@Controller('user-task')
export class UserTaskController {
  constructor(private userTaskService: UserTaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post('answer')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(@Req() req, @Body() dto: any) {
    return await this.userTaskService.addAnswer(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() dto: Partial<UserTask>) {
    return await this.userTaskService.update(req.user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/answer')
  async find(@Req() req, @Param('id') id: string, @Body() dto: any) {
    return await this.userTaskService.find(req.user.id, id, dto.studentId);
  }
}
