import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessageService } from './message.service';

@ApiTags('Сообщения')
@Controller('message')
export class MessageController {
  constructor(
    private messageService: MessageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() dto: {id?: string, content: string, task_id?: string}) {
    const { id } = req.user;
    return this.messageService.create(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('all')
  async findAll(@Req() req, @Body() dto: {room_id: string, task_id: string}) {
    // const { id } = req.user;
    return this.messageService.findAll(req.user.id, dto);
  }

}
