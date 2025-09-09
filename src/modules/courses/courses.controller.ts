import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';
import { PaginationDto } from 'src/common/validation/pagination';

import { CreateCourseDto, CreateCourseSchema } from './dto/create-course.dto';
import { CoursesService } from './courses.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateCourseSchema))
  async create(@Body() dto: CreateCourseDto) {
    return await this.coursesService.create(dto);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(CreateCourseSchema))
  async update(@Param('id') id: string, @Body() dto: CreateCourseDto) {
    return await this.coursesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.coursesService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  // @UsePipes(new ZodValidationPipe(PaginationSchema))
  async getAll(
    @Req() req,
    @Query() query: PaginationDto & { groupId?: string; semesterId?: string; courseId?: string },
  ) {
    return await this.coursesService.getAll(req.user.id, query);
  }

  @Get('info/:id')
  async getInfo(@Param('id') id: string) {
    return await this.coursesService.info(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/students')
  async getStudentsAndTask(
    @Param('id') courseId: string,
    @Req() req,
    @Body()
    dto: {
      semesterId: string;
      groupId: string;
    },
  ) {
    return await this.coursesService.getStudentsAndTask(courseId, dto.semesterId, dto.groupId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.coursesService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tasks')
  async findAllCourseAndCountTask(@Req() req) {
    const { id } = req.user;
    return await this.coursesService.findAllCourseAndCountTask(id);
  }
}
