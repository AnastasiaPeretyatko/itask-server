import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateSemestrDto } from './dto/create-semester.dto';
import { SemestrsService } from './semesters.service';
// import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

@ApiTags('Семестры')
@Controller('semesters')
export class SemestersController {
  constructor(private semestrsService: SemestrsService) {}

  @Post()
  async create(@Res() res: Response, @Body() dto: CreateSemestrDto) {
    const semester = await this.semestrsService.create(dto);
    return res.status(HttpStatus.OK).send(semester);
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() dto: CreateSemestrDto,
  ) {
    const semester = await this.semestrsService.update(id, dto);
    return res.status(HttpStatus.OK).send(semester);
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param('id') id: string) {
    const semester = await this.semestrsService.delete(id);
    return res.status(HttpStatus.OK).send(semester);
  }

  @Get()
  async getAll(@Res() res: Response) {
    const semesters = await this.semestrsService.getAll();
    return res.status(HttpStatus.OK).send(semesters);
  }

  @Get('/list')
  async getList(@Query() { search } : {search: string}){
    return await this.semestrsService.list(search);
  }

  @Get(':id')
  async getOne(@Res() res: Response, @Param('id') id: string) {
    const semester = await this.semestrsService.getOne(id);
    return res.status(HttpStatus.OK).send(semester);
  }

}
