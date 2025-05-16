import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';

@ApiTags('Документы')
@Controller('doc')
export class DocumentsController {
  constructor(private documentsService: DocumentsService ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/doc.create')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(@Req() req, @Body() dto: any) {
    return this.documentsService.create({ ...dto, creatorId: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.documentsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async find(@Req() req) {
    return this.documentsService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.documentsService.find(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.documentsService.delete(id);
  }
}
