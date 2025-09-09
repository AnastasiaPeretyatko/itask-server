import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from 'src/models/user.model';

import { ApiException } from 'src/common/exceptions/api.exceptions';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async find(dto: Partial<User>) {
    return await this.userRepository.findOne({
      where: { ...dto },
    });
  }

  async create(dto: CreateUserDto) {
    const { email, role } = dto;
    const candidate = await this.find({ email });

    if (candidate) {
      throw ApiException.badRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }

    const hashPassword = await this.userRepository.hashPassword('Hello');
    const user = await this.userRepository.create({
      email,
      role,
      password: hashPassword,
    });

    delete user.dataValues.password;

    return user;
  }

  async findByUserForChat(id: string) {
    return await this.userRepository.findAll({ attributes: ['id', 'email'] });
  }
}
