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
  async create(@Req() req, @Body() dto: {room_id: string, content: string}) {
    const { id } = req.user;
    return this.messageService.create(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('all')
  async findAll(@Body() dto: {room_id: string}) {
    // const { id } = req.user;
    return this.messageService.findAll(dto);
  }

}
