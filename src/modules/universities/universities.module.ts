import { Module } from '@nestjs/common';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { University } from 'src/models/university.model';

@Module({
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  imports:[
    SequelizeModule.forFeature([University])
  ]
})
export class UniversitiesModule {}
