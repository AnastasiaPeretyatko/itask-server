import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UpdateProfessorDto } from './dto/update-professor';
import { ROLE } from 'src/common/enum/role';
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
    const { limit = 10, page = 1, search = '' } = query;

    const data = await this.professorRepository.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'fullName'],
          where: search ?{
            role: ROLE.PROFESSOR, //TODO возможно это не требуется
            [Op.or]: [
              { email: { [Op.iLike]: `%${search}%` } }, // Для PostgreSQL, нечувствительно к регистру
              { fullName: { [Op.iLike]: `%${search}%` } },
            ],
          } : {},
        },
      ],
      ...(!search ? { limit, offset: limit * (page - 1) } : {}),
    });

    return data;
  }

  async list(search: string) {
    const data = await this.professorRepository.findAll({
      attributes: ['id'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'fullName'],
          where: search ?{
            role: ROLE.PROFESSOR, //TODO возможно это не требуется
            [Op.or]: [
              { email: { [Op.iLike]: `%${search}%` } }, // Для PostgreSQL, нечувствительно к регистру
              { fullName: { [Op.iLike]: `%${search}%` } },
            ],
          } : {},
        },
      ],
    });

    return data.map((p) => ({ id: p.id, name: p.user.fullName, email: p.user.email }));
  }

  async getId(userId: string) {
    const professor = await this.professorRepository.findOne({ where: { user_id: userId } });
    return { professorId: professor?.id || null, fullName: professor?.fullName };
  }
}
