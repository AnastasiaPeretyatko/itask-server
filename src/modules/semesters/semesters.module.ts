import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Semester } from '../../models/semester.model';
import { StudentsModule } from '../students/students.module';
import { SemestersController } from './semesters.controller';
import { SemestrsService } from './semesters.service';
import { Assignment } from 'src/models/assignment.model';
import { Group } from 'src/models/group.model';

@Module({
  controllers: [SemestersController],
  providers: [SemestrsService],
  imports: [StudentsModule, SequelizeModule.forFeature([Semester, Group, Assignment])],
})
export class SemestersModule {}
