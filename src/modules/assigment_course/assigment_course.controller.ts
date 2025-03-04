import { Body, Controller, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssigmentCourseService } from './assigment_course.service';
import { CreateAssignmentDto, CreateAssignmentSchema } from './dto/create-assinment.dto';
import { UpdateAssignmentDto, UpdateAssignmentSchema } from './dto/update-assinment.dto';
import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

@ApiTags('Связь с курсом')
@Controller('assignment')
export class AssigmentCourseController {
  constructor(private assigmentCourseService: AssigmentCourseService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateAssignmentSchema))
  async add(@Body() dto: CreateAssignmentDto ){
    return await this.assigmentCourseService.create(dto);
  }

  @Patch()
  @UsePipes(new ZodValidationPipe(UpdateAssignmentSchema))
  async updateAssignment(@Body() dto: UpdateAssignmentDto){
    return await this.assigmentCourseService.update(dto);
  }

  @Get(':id')
  async getCourseAssignment(@Param('id') id: string){
    return await this.assigmentCourseService.getRecordForGroup(id);
  }
}