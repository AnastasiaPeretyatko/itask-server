import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from 'src/models/tasks.model';
import { SemesterGroupCourse } from 'src/models/semester-group-course.model';
import { Professor } from 'src/models/professor.model';
import { Student } from 'src/models/student.model';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    SequelizeModule.forFeature([Task, SemesterGroupCourse, Professor, Student]),
  ],
})
export class TasksModule {}
