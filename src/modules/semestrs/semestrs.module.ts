import { Semester } from './../../models/semestr.model';
import { Module } from '@nestjs/common';
import { SemestersController } from './semestrs.controller';
import { SemestrsService } from './semestrs.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [SemestersController],
  providers: [SemestrsService],
  imports: [SequelizeModule.forFeature([Semester])],
})
export class SemestersModule {}
