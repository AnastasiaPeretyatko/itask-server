import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { ProfessorsController } from './professors.controller';
import { ProfessorsService } from './professors.service';
import { Professor } from 'src/models/professor.model';
import { User } from 'src/models/user.model';

@Module({
  controllers: [ProfessorsController],
  providers: [ProfessorsService, UsersService],
  imports: [SequelizeModule.forFeature([Professor, User])],
  exports: [ProfessorsService],
})
export class ProfessorsModule {}
