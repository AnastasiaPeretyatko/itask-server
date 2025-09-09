import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from 'src/models/user.model';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { ProfessorsModule } from '../professors/professors.module';
import { StudentsModule } from '../students/students.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => UsersModule),
    StudentsModule,
    ProfessorsModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
