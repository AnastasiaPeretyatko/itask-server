import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post()
  async createTask(@Body() dto: CreateTaskDto) {
    return await this.taskService.createTask(dto);
  }

  @Patch(':id')
  async updateTask(
    @Res() res: Response,
    @Body() dto: CreateTaskDto,
    @Param('id') id: string,
  ) {
    const data = await this.taskService.update(id, dto);
    return res.status(HttpStatus.OK).send(data);
  }

  @Get(':id')
  async getOneTask(@Res() res: Response, @Body() id: string) {
    const data = await this.taskService.getOne(id);
    return res.status(HttpStatus.OK).send(data);
  }

  @Get()
  async getTasks(@Res() res: Response, @Query() query: { groupId: string }) {
    const data = await this.taskService.getAll(query.groupId);
    return res.status(HttpStatus.OK).send(data);
  }

  @Delete(':id')
  async deleteTask(@Res() res: Response, @Param('id') id: string) {
    const data = await this.taskService.delete(id);
    return res.status(HttpStatus.OK).send(data);
  }
}
