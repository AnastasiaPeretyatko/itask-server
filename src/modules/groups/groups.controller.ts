import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';
import { PaginationDto, PaginationSchema } from 'src/common/validation/pagination';

import { GroupDto, GroupSchema } from './dto/create-group.dto';
import { UpdateGroupDto, UpdateGroupSchema } from './dto/update-group.dto';
import { GroupsService } from './groups.service';

@ApiTags('Группы')
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(GroupSchema))
  async create(@Body() dto: GroupDto) {
    return this.groupsService.create(dto);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateGroupSchema))
  async updateGroup(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateGroupDto) {
    return await this.groupsService.update(id, dto);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(PaginationSchema))
  async getAllGroups(@Query() query: PaginationDto) {
    return await this.groupsService.getAll(query);
  }

  @Get('/groups.id')
  async getAllGroupId() {
    return await this.groupsService.getAllGroupId();
  }

  @Get('/groups.name')
  @UsePipes(new ZodValidationPipe(PaginationSchema))
  async getGroupNameAndId(@Query() query: PaginationDto) {
    return await this.groupsService.getGroupNameAndId(query.search);
  }

  @Get('/:id')
  async getOneGroup(@Param('id', ParseUUIDPipe) id: string) {
    return await this.groupsService.getOne(id);
  }

  @Get('/:id/students')
  async getStudentsByGroup(@Param('id') id: string) {
    return await this.groupsService.getStudentsByGroup(id);
  }
}
