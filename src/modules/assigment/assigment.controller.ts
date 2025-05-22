import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssigmentService } from './assigment.service';
import { CreateAssignmentDto, CreateAssignmentSchema } from './dto/create-assinment.dto';
import { UpdateAssignmentDto, UpdateAssignmentSchema } from './dto/update-assinment.dto';
import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

@ApiTags('Связь с курсом')
@Controller('assignment')
export class AssigmentController {
  constructor(private assigmentCourseService: AssigmentService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateAssignmentSchema))
  async add(@Body() dto: CreateAssignmentDto ){
    return await this.assigmentCourseService.create(dto);
  }

  @Get()
  async getAll() {
    return await this.assigmentCourseService.getAll();
  }

  //TODO исправить update

  @Patch()
  @UsePipes(new ZodValidationPipe(UpdateAssignmentSchema))
  async updateAssignment(@Body() dto: UpdateAssignmentDto){
    return await this.assigmentCourseService.update(dto);
  }

  @Get(':id')
  async getCourseAssignment(@Param('id') id: string){
    return await this.assigmentCourseService.getRecordForGroup(id);
  }

  @Get('professor/:id')
  async foundCoursesForProfessor(@Param('id') id: string){
    return await this.assigmentCourseService.foundCoursesForProfessor(id);
  }

  @Get('semester/:id')
  async foundSemestersForCourse(@Param('id') id: string){
    return await this.assigmentCourseService.foundSemestersForCourse(id);
  }

  @Get('group/:id')
  async getGroupByCourse(@Param('id') id: string, @Query() params: {semesterId: string} ){
    return await this.assigmentCourseService.getGroupByCourse(id, params);
  }

  @Get('semester/:id')
  async getSemesterByCourse(@Param('id') id: string, @Query() params: {groupId: string}){
    return await this.assigmentCourseService.getSemesterByCourse(id, params);
  }

  // TODO delete
  @Get(':id/:semester_id')
  async foundGroupsForCourse(@Param('id') id: string, @Param('semester_id') semester_id: string){
    return await this.assigmentCourseService.foundGroupsForCourse(id, semester_id);
  }
}