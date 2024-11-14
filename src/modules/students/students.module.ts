import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from 'src/models/student.model';
import { User } from 'src/models/user.model';
import { Group } from 'src/models/group.model';
import { UsersService } from '../users/users.service';
import { University } from 'src/models/university.model';


@Module({
  controllers: [StudentsController],
  providers: [StudentsService, UsersService],
  imports:[
    SequelizeModule.forFeature([Student, User, Group, University])
  ]
})
export class StudentsModule {}
