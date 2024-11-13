import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { University } from 'src/models/university.model';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University) private universitiesRepository: typeof University,
  ) {}

  async getAll() {
    return await this.universitiesRepository.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }
}
