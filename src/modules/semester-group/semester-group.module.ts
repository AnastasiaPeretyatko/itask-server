import { Module } from '@nestjs/common';
import { SemesterGroupController } from './semester-group.controller';
import { SemesterGroupService } from './semester-group.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SemesterGroup } from 'src/models/semester-group.model';

@Module({
  controllers: [SemesterGroupController],
  providers: [SemesterGroupService],
  imports: [SequelizeModule.forFeature([SemesterGroup])],
})
export class SemesterGroupModule {}
