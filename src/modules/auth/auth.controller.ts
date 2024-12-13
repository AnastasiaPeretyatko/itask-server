import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Res() res: Response, @Body() dto: { email: string; password: string }) {
    const user = await this.authService.login(dto.email, dto.password);
    return res.status(HttpStatus.OK).send(user);
  }
}
