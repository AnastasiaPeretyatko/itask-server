import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

import { SemesterDto, SemesterSchema } from './dto/create-semester.dto';
import { SemestrsService } from './semesters.service';
// import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

@ApiTags('Семестры')
@Controller('semesters')
export class SemestersController {
  constructor(private semestrsService: SemestrsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(SemesterSchema))
  async create(@Body() dto: SemesterDto) {
    return await this.semestrsService.create(dto);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(SemesterSchema))
  async update(@Param('id') id: string, @Body() dto: SemesterDto) {
    return await this.semestrsService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.semestrsService.delete(id);
  }

  @Get()
  async getAll() {
    return await this.semestrsService.getAll();
  }

  //Получение семестров для студента
  @Get('/student/:id')
  async getAllByStudent(@Param('id') id: string) {
    return await this.semestrsService.getAllByStudent(id);
  }

  @Get('/list')
  async getList(@Query() { search }: { search: string }) {
    return await this.semestrsService.list(search);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.semestrsService.getOne(id);
  }
}
