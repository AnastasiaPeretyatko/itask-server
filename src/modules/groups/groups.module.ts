import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { CourseAssignment } from 'src/models/course_assignment.model';
import { Group } from 'src/models/group.model';
import { Student } from 'src/models/student.model';
import { University } from 'src/models/university.model';
import { User } from 'src/models/user.model';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports:[
    SequelizeModule.forFeature([Group, University, Student, User, CourseAssignment]),
  ],
})
export class GroupModule {}
