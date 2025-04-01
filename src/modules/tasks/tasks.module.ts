import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Professor } from 'src/models/professor.model';
import { Student } from 'src/models/student.model';
import { Task } from 'src/models/tasks.model';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    SequelizeModule.forFeature([Task, Professor, Student]),
  ],
})
export class TasksModule {}
