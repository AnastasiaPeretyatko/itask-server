import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from 'src/models/user.model';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() dto: { email: string; role: string }) {
    return this.usersService.create(dto.email, dto.role);
  }

  @ApiOperation({ summary: 'Получение одного пользователя' })
  @ApiResponse({ status: 200, type: [User] })
  @Get(':id')
  async find(@Body() dto: User) {
    return await this.usersService.find(dto);
  }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req) {
    return await this.usersService.findByUserForChat(req.user.id);
  }
}
