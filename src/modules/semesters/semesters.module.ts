import { Semester } from '../../models/semester.model';
import { Module } from '@nestjs/common';
import { SemestersController } from './semesters.controller';
import { SemestrsService } from './semesters.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/models/group.model';
import { SemesterGroup } from 'src/models/semester-group.model';
import { Professor } from 'src/models/professor.model';

@Module({
  controllers: [SemestersController],
  providers: [SemestrsService],
  imports: [
    SequelizeModule.forFeature([Semester, Group, SemesterGroup, Professor]),
  ],
})
export class SemestersModule {}
