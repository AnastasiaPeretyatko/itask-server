import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto, CreateCourseSchema } from './dto/create-course.dto';
import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';
import { PaginationDto, PaginationSchema } from 'src/common/validation/pagination';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) { }

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

  @Get()
  @UsePipes(new ZodValidationPipe(PaginationSchema))
  async getAll(@Query() query: PaginationDto) {
    return await this.coursesService.getAll(query);
  }

  @Get('info/:id')
  async getInfo(@Param('id') id: string) {
    return await this.coursesService.info(id);
  }

  @Get('list.groups/:id')
  async getGroups(@Param('id') id: string) {
    return await this.coursesService.getGroups(id);
  }

  //TODO Выяснить нужен ли этот эндпоинт
  @Post('assignment')
  async assigningGroupToCourse(@Body() { id, courseId }: { id: string, courseId: string }) {
    return await this.coursesService.assigningGroupToCourse(id, courseId);
  }

  // Получение курсов для студента
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getAllCourseForSemester(@Req() req, @Query() query: {semesterId: string, groupId: string}) {
    const { id } = req.user;
    return await this.coursesService.getAllCourseForStudent(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/students')
  async getStudentsAndTask(@Param('id') courseId: string, @Req() req, @Body() dto: {
      semesterId: string,
      groupId: string
    }) {
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
