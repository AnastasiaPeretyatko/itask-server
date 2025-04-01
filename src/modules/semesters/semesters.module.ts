import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Semester } from '../../models/semester.model';
import { SemestersController } from './semesters.controller';
import { SemestrsService } from './semesters.service';
import { Group } from 'src/models/group.model';

@Module({
  controllers: [SemestersController],
  providers: [SemestrsService],
  imports: [SequelizeModule.forFeature([Semester, Group])],
})
export class SemestersModule {}
