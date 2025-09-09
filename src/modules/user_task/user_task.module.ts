import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Document } from 'src/models/documents.model';
import { Student } from 'src/models/student.model';
import { Task } from 'src/models/tasks.model';
import { UserTask } from 'src/models/user_task.model';

import { UserTaskController } from './user_task.controller';
import { UserTaskService } from './user_task.service';

import { AuthModule } from '../auth/auth.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  controllers: [UserTaskController],
  providers: [UserTaskService],
  imports: [SequelizeModule.forFeature([Task, UserTask, Document, Student]), AuthModule, TasksModule],
})
export class UserTaskModule {}
