import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { ApiException } from 'src/common/exceptions/api.exceptions';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async create(email: string, role: string) {
    const candidate = await this.userRepository.findOne({
      where: { email: email },
    });

    if (candidate) {
      throw ApiException.badRequest(
        `Пользователь с почтовым адресом ${email} уже существует`,
      );
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
}
