import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SemesterGroupCourseService } from './semester-group-course.service';
import { Response } from 'express';

@ApiTags('Семестры группы курса')
@Controller('semester-group-course')
export class SemesterGroupCourseController {
  constructor(private semesterGroupCourseService: SemesterGroupCourseService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Body() dto: { groupId: string; courseId: string },
  ) {
    const data =
      await this.semesterGroupCourseService.addSubjectToSemester(dto);
    return res.status(HttpStatus.OK).send(data);
  }

  @Get(':id')
  async getAll(@Res() res: Response, @Param('id', ParseUUIDPipe) id: string) {
    const data =
      await this.semesterGroupCourseService.getSubjectsBySemesterAndGroup(id);
    return res.status(HttpStatus.OK).send(data);
  }

  @Delete(':semesterGroupId/:courseId')
  async delete(
    @Res() res: Response,
    @Param('semesterGroupId', ParseUUIDPipe) semesterGroupId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    const data = await this.semesterGroupCourseService.delete(
      semesterGroupId,
      courseId,
    );
    return res.status(HttpStatus.OK).send(data);
  }
}
