import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { User } from 'src/models/user.model';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ROLE } from 'src/common/enum/role';
import { Student } from 'src/models/student.model';
import { Professor } from 'src/models/professor.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Student) private studentRepository: typeof Student,
    @InjectModel(Professor) private professorRepository: typeof Professor,

    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    let student = {} as Student;
    let professor = {} as Professor;

    delete user.dataValues.password;

    if (user.role === ROLE.STUDENT) {
      student = await this.studentRepository.findOne({
        where: { user_id: user.id },
      });
      professor = null;
    } else if (user.role === ROLE.PROFESSOR) {
      professor = await this.professorRepository.findOne({
        where: { user_id: user.id },
      });
      student = null;
    }

    const data = {
      ...user.dataValues,
      groupId: student ? student.group_id : null,
      studentId: student?.id ?? null,
      professorId: professor?.id ?? null,
      fullNmae: student?.fullName ?? professor?.fullName,
    };

    return {
      user: {
        ...data,
      },
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
