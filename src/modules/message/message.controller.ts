import { Body, Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ZodValidationPipe } from 'src/common/utils/zod-validation.pipe';

import { MessageCreateDto, MessageSchema } from './dto/message.create';
import { MessageService } from './message.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Сообщения')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(MessageSchema))
  async create(@Req() req, @Body() dto: MessageCreateDto) {
    const { id } = req.user;
    return this.messageService.create(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('all')
  async findAll(@Req() req, @Body() dto: { room_id: string; task_id: string }) {
    return this.messageService.findAll(req.user.id, dto);
  }
}
