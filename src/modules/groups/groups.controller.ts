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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Group } from 'src/models/group.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetAllGroup } from './dto/get-groups.dto';
import { Response } from 'express';
import { GroupsService } from './groups.service';

@ApiTags('Группы')
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post()
  async create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Patch('/:id')
  async updateGroup(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGroupDto,
  ) {
    const data = await this.groupsService.update(id, dto)
    return res.status(HttpStatus.OK).send(data)
  }

  @Get()
  async getAllGroups(@Res() res: Response, @Query() query: GetAllGroup){
    const data = await this.groupsService.getAll(query)
    return res.status(HttpStatus.OK).send(data)
  }

  @Get('/:id')
  async getOneGroup(@Res() res: Response, @Param('id', ParseUUIDPipe) id: string){
    const data = await this.groupsService.getOne(id)
    return res.status(HttpStatus.OK).send(data)
  }
}
