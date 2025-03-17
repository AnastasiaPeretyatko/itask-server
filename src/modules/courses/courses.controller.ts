import {
  Body,
  Controller,
  Delete,
  Get, Param,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { GetCoursesDto, GetCoursesSchema } from './dto/get-course.dto';
import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) { }

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    return await this.coursesService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CreateCourseDto) {
    return await this.coursesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.coursesService.delete(id);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(GetCoursesSchema))
  async getAll(@Query() query: GetCoursesDto) {
    return await this.coursesService.getAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.coursesService.getOne(id);
  }

  @Get('info/:id')
  async getInfo(@Param('id') id: string) {
    return await this.coursesService.info(id);
  }

  @Get('list.groups/:id')
  async getGroups(@Param('id') id: string) {
    return await this.coursesService.getGroups(id);
  }

  @Post('assignment')
  async assigningGroupToCourse(@Res() res: Response, @Body() { id, courseId }: { id: string, courseId: string }) {
    return await this.coursesService.assigningGroupToCourse(id, courseId);
  }
}
