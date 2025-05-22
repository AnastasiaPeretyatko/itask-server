import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Assignment } from 'src/models/assignment.model';
import { Professor } from 'src/models/professor.model';
import { Student } from 'src/models/student.model';
import { Task } from 'src/models/tasks.model';
import { UserTask } from 'src/models/user_task.model';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    SequelizeModule.forFeature([Task, Professor, Student, Assignment, UserTask]),
    AuthModule,
  ],
  exports: [TasksService],
})
export class TasksModule {}
