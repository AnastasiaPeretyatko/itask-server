import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, CreateTaskSchema } from './dto/create-task.dto';
import { GetAllTaskDto, GetAllTaskSchema } from './dto/getAll.dto';
import { TasksService } from './tasks.service';
import { TaskStatus } from 'src/common/enum/task';
import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateTaskSchema))
  async create(@Body() dto: CreateTaskDto) {
    return await this.taskService.create(dto);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(GetAllTaskSchema))
  async getAll(@Query() query: GetAllTaskDto) {
    return await this.taskService.all(query);
  }

  @Get('/student/:id')
  async getTasksForStudent(@Param('id') id: string) {
    return await this.taskService.getTasksForStudent(id);
  }

  @Patch('user_task/:id')
  async updateStatusTask(@Param('id') id: string, @Body() dto: { status: TaskStatus }) {
    return await this.taskService.updateStatusTask(id, dto.status);
  }
}
