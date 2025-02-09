import { Module } from '@nestjs/common';
import { Course } from 'src/models/courses.model';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Semester } from 'src/models/semester.model';
import { SemesterGroup } from 'src/models/semester-group.model';
import { SemesterGroupCourse } from 'src/models/semester-group-course.model';
import { ProfessorCourse } from 'src/models/professor-course.model';
import { Professor } from 'src/models/professor.model';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [
    SequelizeModule.forFeature([
      Course,
      SemesterGroup,
      ProfessorCourse,
      Professor,
      SemesterGroupCourse,
    ]),
  ],
})
export class CoursesModule {}
