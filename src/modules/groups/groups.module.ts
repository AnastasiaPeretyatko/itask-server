import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/models/group.model';
import { GroupsService } from './groups.service';
import { University } from 'src/models/university.model';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports:[
    SequelizeModule.forFeature([Group, University])
  ]
})
export class GroupModule {}
