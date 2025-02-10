import { Module } from "@nestjs/common";
import { Course } from "src/models/courses.model";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Professor } from 'src/models/professor.model';
import { CourseAssignment } from 'src/models/course_assignment.model';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [
    SequelizeModule.forFeature([Course, Professor, CourseAssignment]),
  ]
})

export class CoursesModule {}