import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { User } from 'src/models/user.model';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    delete user.dataValues.password;

    return {
      user,
      token: await this.generateToken(user),
    };
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.role };
    return this.jwtService.sign(payload);
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw ApiException.badRequest('Пользователь не найден');

    const passwordEquals = await this.userRepository.comparePassword(
      password,
      user,
    );

    if (!passwordEquals)
      throw ApiException.unautorized(`Пользователь не найден`);

    return user;
  }
}
