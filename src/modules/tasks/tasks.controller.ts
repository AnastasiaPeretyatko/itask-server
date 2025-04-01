import {
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';

@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  // @Post()
  // async createTask(@Body() dto: CreateTaskDto) {
  //   return await this.taskService.createTask(dto);
  // }

  // @Patch(':id')
  // async updateTask(@Body() dto: CreateTaskDto, @Param('id') id: string) {
  //   return await this.taskService.update(id, dto);
  // }

  // @Get(':id')
  // async getOneTask(@Body() id: string) {
  //   return await this.taskService.getOne(id);
  // }

  // @Get()
  // async getTasks(@Query() query: { groupId: string }) {
  //   return await this.taskService.getAll(query.groupId);
  // }

  // @Delete(':id')
  // async deleteTask(@Param('id') id: string) {
  //   return await this.taskService.delete(id);
  // }
}
