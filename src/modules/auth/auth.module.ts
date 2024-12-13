import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/models/user.model';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([User]),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
