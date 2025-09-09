import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROLE } from 'src/common/enum/role';
import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';
import { PaginationDto, PaginationSchema } from 'src/common/validation/pagination';

import { StudentDto, StudentSchema } from './dto/create-student.dto';
import { StudentsService } from './students.service';

import { UsersService } from '../users/users.service';

@ApiTags('Группы')
@Controller('students')
export class StudentsController {
  constructor(
    private studentService: StudentsService,
    private usersService: UsersService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(StudentSchema))
  async create(@Body() dto: StudentDto) {
    const user = await this.usersService.create(dto.email, ROLE.STUDENT);
    return await this.studentService.create(user.id, dto);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(StudentSchema))
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: StudentDto) {
    return await this.studentService.update(id, dto);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(PaginationSchema))
  async getAll(@Query() query: PaginationDto) {
    return await this.studentService.getAll(query);
  }
}
