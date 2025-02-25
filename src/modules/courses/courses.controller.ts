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
import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) { }

  @Post()
  async create(
    @Res() res: Response,
    @Body() dto: CreateCourseDto,
  ) {
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

  @Get('info/:id')
  async getInfo(@Res() res: Response, @Param('id') id: string) {
    const course = await this.coursesService.info(id);
    return res.status(HttpStatus.OK).send(course);
  }

  @Get('list.groups/:id')
  async getGroups(@Res() res: Response, @Param('id') id: string) {
    const groups = await this.coursesService.getGroups(id);
    return res.status(HttpStatus.OK).send(groups);
  }

  @Post('assignment')
  async assigningGroupToCourse(@Res() res: Response, @Body() { id, courseId }: { id: string, courseId: string }) {
    console.log(id, courseId);
    return res.status(HttpStatus.OK).send(await this.coursesService.assigningGroupToCourse(id, courseId))
  }
}
