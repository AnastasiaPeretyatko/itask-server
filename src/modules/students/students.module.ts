import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from 'src/models/student.model';
import { User } from 'src/models/user.model';


@Module({
  controllers: [StudentsController],
  providers: [StudentsService, UsersService],
  imports:[
    SequelizeModule.forFeature([Student, User]),
  ],
  exports: [StudentsService],
})
export class StudentsModule {}
