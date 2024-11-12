import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfessorsService } from './professors.service';
import { CreateProfessorDto } from './dto/create-professor';
import { UsersService } from '../users/users.service';
import { UpdateProfessorDto } from './dto/update-professor';
import { GetProfessorsDto } from './dto/get-professor';
import { Response } from 'express';
import { ROLE } from 'src/common/enum/role';

@ApiTags('Преподаватели')
@Controller('professors')
export class ProfessorsController {
  constructor(
    private professorsService: ProfessorsService,
    private usersService: UsersService,
  ) {}

  @Post()
  async create(@Res() res: Response, @Body() dto: CreateProfessorDto) {
    const user = await this.usersService.create(dto.email, ROLE.PROFESSOR);
    const data = await this.professorsService.create(user.id, dto.fullName);
    return res.status(HttpStatus.OK).send(data)
  }

  @Patch('/:id')
  async updateUser(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfessorDto,
  ) {
    const data = await this.professorsService.update(id, dto);
    return res.status(HttpStatus.OK).send(data)
  }

  @Get()
  async getAll(@Res() res: Response, @Query() query: GetProfessorsDto) {
    const data = await this.professorsService.getAll(query);
    return res.status(HttpStatus.OK).send(data);
  }
}
