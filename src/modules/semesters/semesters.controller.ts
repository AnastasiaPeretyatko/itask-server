import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SemestrsService } from './semesters.service';
import { CreateSemestrDto } from './dto/create-semester.dto';
import { ROLE } from 'src/common/enum/role';

@ApiTags('Семестры')
@Controller('semesters')
export class SemestersController {
  constructor(private semestrsService: SemestrsService) {}

  @Post()
  async create(@Res() res: Response, @Body() dto: CreateSemestrDto) {
    const semestr = await this.semestrsService.create(dto);
    return res.status(HttpStatus.OK).send(semestr);
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() dto: CreateSemestrDto,
  ) {
    const semestr = await this.semestrsService.update(id, dto);
    return res.status(HttpStatus.OK).send(semestr);
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param('id') id: string) {
    const semestr = await this.semestrsService.delete(id);
    return res.status(HttpStatus.OK).send(semestr);
  }

  @Get()
  async getAll(@Res() res: Response) {
    const semestrs = await this.semestrsService.getAll();
    return res.status(HttpStatus.OK).send(semestrs);
  }

  @Get(':id')
  async getOne(@Res() res: Response, @Param('id') id: string) {
    const semestr = await this.semestrsService.getOne(id);
    return res.status(HttpStatus.OK).send(semestr);
  }

  // Получение списка семестров для группы и для преподователя
  @Get('list/:id/')
  async getList(@Res() res: Response, @Param('id') id: string, @Query() query: { role: ROLE }) {
    const semesters = await this.semestrsService.getList(id, query.role);
    return res.status(HttpStatus.OK).send(semesters);
  }
}
