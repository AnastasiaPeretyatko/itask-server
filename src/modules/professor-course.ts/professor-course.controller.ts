import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfessorCourseService } from './professor-course.service';
import { Response } from 'express';
import { CreateProfessorCourseDto } from './dto/create.professor-course.dto';

@ApiTags('Преподаватели и курсы')
@Controller('professor-course')
export class ProfessorCourseController {
  constructor(private professorCourseService: ProfessorCourseService) {}

  @Post()
  async create(@Res() res: Response, @Body() dto: CreateProfessorCourseDto) {
    const data = await this.professorCourseService.create(dto);
    return res.status(HttpStatus.OK).send(data);
  }

  //Получение всех прреподавателей у которых есть курсы
  @Get(':id')
  async getAll(@Res() res: Response, @Param('id', ParseUUIDPipe) id: string) {
    const data = await this.professorCourseService.getAllProfessors(id);
    return res.status(HttpStatus.OK).send(data);
  }
}
