import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Professor } from 'src/models/professor.model';
import { ProfessorCourseController } from './professor-course.controller';
import { ProfessorCourseService } from './professor-course.service';
import { User } from 'src/models/user.model';
import { SemesterGroupCourseModule } from '../semester-group-course/semester-group-course.module';
import { SemesterGroupCourse } from 'src/models/semester-group-course.model';
import { Course } from 'src/models/courses.model';
import { SemesterGroup } from 'src/models/semester-group.model';
import { ProfessorCourse } from 'src/models/professor-course.model';
import { Group } from 'src/models/group.model';
import { Semester } from 'src/models/semester.model';
import { University } from 'src/models/university.model';

@Module({
  controllers: [ProfessorCourseController],
  providers: [ProfessorCourseService],
  imports: [
    SequelizeModule.forFeature([
      Professor,
      User,
      SemesterGroupCourse,
      Course,
      SemesterGroup,
      ProfessorCourse,
      Group,
      Semester,
      University,
    ]),
    SemesterGroupCourseModule,
  ],
})
export class ProfessorCourseModule {}
