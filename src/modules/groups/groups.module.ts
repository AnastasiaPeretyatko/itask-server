import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/models/group.model';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports:[
    SequelizeModule.forFeature([Group])
  ]
})
export class GroupModule {}
