import { Module } from "@nestjs/common";
import { Course } from "src/models/courses.model";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [
    SequelizeModule.forFeature([Course])
  ]
})

export class CoursesModule {}