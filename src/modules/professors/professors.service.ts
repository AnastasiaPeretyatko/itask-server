import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, Op } from 'sequelize';
import { UpdateProfessorDto } from './dto/update-professor';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { PaginationDto } from 'src/common/validation/pagination';
import { Professor } from 'src/models/professor.model';
import { User } from 'src/models/user.model';

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectModel(Professor) private professorRepository: typeof Professor,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async getOne(id: string) {
    const professor = await this.professorRepository.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email'],
        },
      ],
    });

    return professor;
  }

  async create(userId: string, fullName: string) {
    const professor = await this.professorRepository.create({
      user_id: userId,
      fullName,
    });

    const professorData = await this.getOne(professor.id);

    return { data: professorData, message: 'Преподаватель успешно создан' };
  }

  async update(id: string, dto: UpdateProfessorDto) {
    const user = await this.professorRepository.findByPk(id);

    if (!user) {throw ApiException.notFound('Преподаватель не найден');}

    await user.update(dto);
    await user.save();

    return await this.getOne(user.id);
  }

  async getAll(query: PaginationDto) {
    const { limit = 10, page = 1, search } = query;

    const whereConditions = search
      ? {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('fullName')), {
            [Op.like]: `%${search.toLowerCase()}%`,
          }),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('user.email')),
            {
              [Op.like]: `%${search.toLowerCase()}%`,
            },
          ),
        ],
      }
      : {};

    const data = await this.professorRepository.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email'],
        },
      ],
      limit,
      offset: limit * (page - 1),
    });

    return data;
  }

  async list(search: string) {
    const whereConditions = search
      ? {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('fullName')), {
            [Op.like]: `%${search.toLowerCase()}%`,
          }),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('user.email')),
            {
              [Op.like]: `%${search.toLowerCase()}%`,
            },
          ),
        ],
      }
      : {};

    const professors = await this.professorRepository.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email'],
        },
      ],
      where: whereConditions,
    });

    if (!professors) {throw ApiException.notFound('Преподаватели не найдены');}

    const result = professors.map((professor) => {
      return {
        id: professor.id,
        name: professor.fullName,
        email: professor.user.email,
      };
    });

    return result;
  }
}
