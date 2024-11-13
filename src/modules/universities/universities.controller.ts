import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Университеты')
@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Get()
  async getAllGroups(@Res() res: Response) {
    const data = await this.universitiesService.getAll();
    return res.status(HttpStatus.OK).send(data);
  }
}
