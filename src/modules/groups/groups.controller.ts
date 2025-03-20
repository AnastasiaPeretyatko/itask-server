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
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateGroupDto } from './dto/create-group.dto';
import { GetAllGroup } from './dto/get-groups.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
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
    const data = await this.groupsService.update(id, dto);
    return res.status(HttpStatus.OK).send(data);
  }

  @Get()
  async getAllGroups(@Res() res: Response, @Query() query: GetAllGroup) {
    const data = await this.groupsService.getAll(query);
    return res.status(HttpStatus.OK).send(data);
  }

  @Get('/groups.id')
  async getAllGroupId(@Res() res: Response) {
    const data = await this.groupsService.getAllGroupId();
    return res.status(HttpStatus.OK).send(data);
  }

  @Get('/groups.name')
  async getGroupNameAndId(@Res() res: Response, @Query() query: GetAllGroup) {
    const data = await this.groupsService.getGroupNameAndId(query.search);
    return res.status(HttpStatus.OK).send(data);
  }

  @Get('/:id')
  async getOneGroup(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const data = await this.groupsService.getOne(id);
    return res.status(HttpStatus.OK).send(data);
  }

  @Get('/:id/students')
  async getStudentsByGroup(@Res() res: Response, @Param('id') id: string) {
    const data = await this.groupsService.getStudentsByGroup(id);
    return res.status(HttpStatus.OK).send(data);
  }

  @Get('/:id/courses')
  async getCoursesByGroup(@Res() res: Response, @Param('id') id: string) {
    const data = await this.groupsService.getCoursesByGroup(id);
    return res.status(HttpStatus.OK).send(data);
  }
}
