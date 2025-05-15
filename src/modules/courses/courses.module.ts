import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Assignment } from 'src/models/assignment.model';
import { Course } from 'src/models/courses.model';
import { Professor } from 'src/models/professor.model';
import { Student } from 'src/models/student.model';
import { User } from 'src/models/user.model';
import { UserTask } from 'src/models/user_task.model';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [
    SequelizeModule.forFeature([Course, Professor, Assignment, User, Student, UserTask]), AuthModule,
  ],
})

export class CoursesModule {}