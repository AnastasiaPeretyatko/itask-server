import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserTaskController } from './user_task.controller';
import { UserTaskService } from './user_task.service';
import { Task } from 'src/models/tasks.model';
import { UserTask } from 'src/models/user_task.model';

@Module({
  controllers: [UserTaskController],
  providers: [UserTaskService],
  imports: [
    SequelizeModule.forFeature([Task, UserTask]),
  ],
})
export class UserTaskModule {}
