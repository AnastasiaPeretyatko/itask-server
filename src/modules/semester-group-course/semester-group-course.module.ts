import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SemesterGroup } from 'src/models/semester-group.model';
import { SemesterGroupCourseController } from './semester-group-course.controller';
import { SemesterGroupCourseService } from './semester-group-course.service';
import { SemesterGroupCourse } from 'src/models/semester-group-course.model';
import { Course } from 'src/models/courses.model';

@Module({
  controllers: [SemesterGroupCourseController],
  providers: [SemesterGroupCourseService],
  imports: [SequelizeModule.forFeature([SemesterGroupCourse, SemesterGroup, Course])],
  exports: [SemesterGroupCourseService],
})
export class SemesterGroupCourseModule {}
