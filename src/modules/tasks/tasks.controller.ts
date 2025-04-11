import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, CreateTaskSchema } from './dto/create-task.dto';
import { GetAllTaskDto, GetAllTaskSchema } from './dto/getAll.dto';
import { TasksService } from './tasks.service';
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
}
