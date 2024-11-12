import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from 'src/models/group.model';

@Injectable()
export class StudentsService {
  constructor(@InjectModel(Group) private groupRepository: typeof Group) {}
}
