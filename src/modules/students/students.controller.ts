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
import { StudentsService } from './students.service';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Response } from 'express';
import { GetStudentsDto } from './dto/get-students.dto';
import { ROLE } from 'src/common/enum/role';
@ApiTags('Группы')
@Controller('students')
export class StudentsController {
  constructor(
    private studentService: StudentsService,
    private usersService: UsersService,
  ) {}

  @Post()
  async create(@Res() res: Response, @Body() dto: CreateStudentDto) {
    const user = await this.usersService.create(dto.email, ROLE.STUDENT);
    const data = await this.studentService.create(user.id, dto);
    return res.status(HttpStatus.OK).send(data);
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateStudentDto,
  ) {
    const data = await this.studentService.update(id, dto);
    return res.status(HttpStatus.OK).send(data);
  }

  @Get()
  async getAll(@Res() res: Response, @Query() query: GetStudentsDto) {
    const data = await this.studentService.getAll(query);
    return res.status(HttpStatus.OK).send(data);
  }
}
