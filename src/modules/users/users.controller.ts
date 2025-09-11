import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from 'src/models/user.model';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, type: User })
  @ApiResponse({ status: 400, description: 'Пользователь уже существует' })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
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
