import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { ProfessorsService } from '../professors/professors.service';
import { StudentsService } from '../students/students.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly userService: UsersService,
    private readonly studentService: StudentsService,
    private readonly professorService: ProfessorsService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    delete user.dataValues.password;
    const professor = await this.professorService.getId(user.id);
    const student = await this.studentService.getId(user.id);
    return {
      user: {
        ...user.dataValues,
        ...professor,
        ...student,
      },
      token: await this.generateToken(user),
    };
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.role };
    return this.jwtService.sign(payload);
  }

  private async validateUser(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userService.findByEmail(email);
    if (!user) {throw ApiException.badRequest('Пользователь не найден');}

    const passwordEquals = await this.userRepository.comparePassword(
      password,
      user,
    );

    if (!passwordEquals)
    {throw ApiException.unautorized(`Пользователь не найден`);}

    return user;
  }
}
