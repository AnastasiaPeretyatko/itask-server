import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Assignment } from 'src/models/assignment.model';
import { Group } from 'src/models/group.model';
import { Student } from 'src/models/student.model';
import { University } from 'src/models/university.model';
import { User } from 'src/models/user.model';

import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [SequelizeModule.forFeature([Group, University, Student, User, Assignment])],
})
export class GroupModule {}
