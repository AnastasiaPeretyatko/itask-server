import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Assignment } from 'src/models/assignment.model';
import { Group } from 'src/models/group.model';

import { SemestersController } from './semesters.controller';
import { SemestrsService } from './semesters.service';

import { Semester } from '../../models/semester.model';
import { StudentsModule } from '../students/students.module';

@Module({
  controllers: [SemestersController],
  providers: [SemestrsService],
  imports: [StudentsModule, SequelizeModule.forFeature([Semester, Group, Assignment])],
})
export class SemestersModule {}
