import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Group } from 'src/models/group.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetAllGroup } from './dto/get-groups.dto';
import { Response } from 'express';

@ApiTags('Группы')
@Controller('groups')
export class StudentsController {
  constructor(private groupsService: StudentsService) {}

  @ApiOperation({ summary: 'Создание группы' })
  @ApiResponse({ status: 200, type: Group })
  @Post()
  create(@Body() dto: CreateGroupDto) {
  }

}
