import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TaskStatus } from 'src/common/enum/task';
import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

import { CreateTaskDto, CreateTaskSchema } from './dto/create-task.dto';
import { GetAllTaskDto, GetAllTaskSchema } from './dto/getAll.dto';
import { TasksService } from './tasks.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Body(new ZodValidationPipe(CreateTaskSchema)) dto: CreateTaskDto) {
    return await this.taskService.create(req.user.id, dto);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(GetAllTaskSchema))
  async getAll(@Query() query: GetAllTaskDto) {
    return await this.taskService.all(query);
  }

  @Get('/student/:id')
  async getTasksForStudent(@Param('id') id: string, @Query() query: { month: string }) {
    return await this.taskService.getTasksForStudent(id, query?.month);
  }

  @Patch('user_task/:id')
  async updateStatusTask(@Param('id') id: string, @Body() dto: { status: TaskStatus }) {
    return await this.taskService.updateStatusTask(id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    return await this.taskService.one(id, req.user.id);
  }
}
