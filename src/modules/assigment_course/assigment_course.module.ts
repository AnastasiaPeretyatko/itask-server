import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssigmentCourseController } from './assigment_course.controller';
import { AssigmentCourseService } from './assigment_course.service';
import { CourseAssignment } from 'src/models/course_assignment.model';
import { Course } from 'src/models/courses.model';
import { Professor } from 'src/models/professor.model';
import { User } from 'src/models/user.model';

@Module({
  controllers: [AssigmentCourseController],
  providers: [AssigmentCourseService],
  imports: [
    SequelizeModule.forFeature([Course, Professor, CourseAssignment, User]),
  ],
})

export class AssigmentCourseModule {}