import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';
import { University } from 'src/models/university.model';

@Module({
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  imports:[
    SequelizeModule.forFeature([University]),
  ],
})
export class UniversitiesModule {}
