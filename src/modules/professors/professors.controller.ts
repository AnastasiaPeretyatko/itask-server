import {
  Body,
  Controller,
  Get, Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { ProfessorDto, ProfessorSchema } from './dto/create-professor';
import { UpdateProfessorDto, UpdateProfessorSchema } from './dto/update-professor';
import { ProfessorsService } from './professors.service';
import { ROLE } from 'src/common/enum/role';
import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';
import { PaginationDto, PaginationSchema } from 'src/common/validation/pagination';

@ApiTags('Преподаватели')
@Controller('professors')
export class ProfessorsController {
  constructor(
    private professorsService: ProfessorsService,
    private usersService: UsersService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(ProfessorSchema))
  async create(@Body() dto: ProfessorDto) {
    const user = await this.usersService.create(dto.email, ROLE.PROFESSOR);
    return await this.professorsService.create(user.id, dto.fullName);
  }

  @Patch('/:id')
  @UsePipes(new ZodValidationPipe(UpdateProfessorSchema))
  async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProfessorDto) {
    return await this.professorsService.update(id, dto);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(PaginationSchema))
  async getAll(@Query() query: PaginationDto) {
    return await this.professorsService.getAll(query);
  }

  @Get('/list')
  async getProfessorsList(@Query() query: {search: string}) {
    return await this.professorsService.list(query.search);
  }
}
