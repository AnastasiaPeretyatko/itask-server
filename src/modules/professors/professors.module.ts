import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Professor } from 'src/models/professor.model';
import { ProfessorsController } from './professors.controller';
import { ProfessorsService } from './professors.service';
import { User } from 'src/models/user.model';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [ProfessorsController],
  providers: [ProfessorsService, UsersService],
  imports: [SequelizeModule.forFeature([Professor, User])],
})
export class ProfessorsModule {}
