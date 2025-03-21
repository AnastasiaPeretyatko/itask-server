import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssigmentController } from './assigment.controller';
import { AssigmentService } from './assigment.service';
import { Assignment } from 'src/models/assignment.model';
import { Course } from 'src/models/courses.model';
import { Professor } from 'src/models/professor.model';
import { User } from 'src/models/user.model';

@Module({
  controllers: [AssigmentController],
  providers: [AssigmentService],
  imports: [
    SequelizeModule.forFeature([Course, Professor, Assignment, User]),
  ],
})

export class AssigmentModule {}