import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/models/group.model';
import { GroupsService } from './groups.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports:[
    SequelizeModule.forFeature([Group])
  ]
})
export class GroupModule {}
