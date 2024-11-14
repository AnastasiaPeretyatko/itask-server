import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Response } from 'express';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  async create(@Res() res: Response, @Body() dto: CreateCourseDto) {
    const course = await this.coursesService.create(dto);
    return res.status(HttpStatus.OK).send(course);
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() dto: CreateCourseDto,
  ) {
    const course = await this.coursesService.update(id, dto);
    return res.status(HttpStatus.OK).send(course);
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param('id') id: string) {
    const course = await this.coursesService.delete(id);
    return res.status(HttpStatus.OK).send(course);
  }

  @Get()
  async getAll(@Res() res: Response) {
    const courses = await this.coursesService.getAll();
    return res.status(HttpStatus.OK).send(courses);
  }

  @Get(':id')
  async getOne(@Res() res: Response, @Param('id') id: string) {
    const course = await this.coursesService.getOne(id);
    return res.status(HttpStatus.OK).send(course);
  }
}
