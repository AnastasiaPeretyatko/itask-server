import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoomService } from './room.service';

@ApiTags('Комната')
@Controller('room')
export class RoomController {
  constructor(
    private roomService: RoomService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() dto: { userIds: string[] | null, title: string, task_id?: string, access?: string }) {
    const { id } = req.user;
    return await this.roomService.create(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async findAllRoom(@Req() req) {
    const { id } = req.user;
    return await this.roomService.findAll(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/room.for.task')
  async findRoomForTask(@Req() req, @Body() dto: { task_id: string }) {
    const { id } = req.user;
    return await this.roomService.findRoomForTask(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete.user-room')
  async deleteUserFromRoom(@Req() req, @Body() dto: {roomId: string, userId: string}) {
    const { id } = req.user;
    return this.roomService.deleteUserFromRoom(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete')
  async deleteRoom(@Req() req, @Body() dto: {roomId: string}) {
    const { id } = req.user;
    return this.roomService.deleteRoom(id, dto);
  }

  //TODO нужен был для проверки сейчас на фронте не используется
  // @UseGuards(JwtAuthGuard)
  // @Post('/user-room')
  // async findUserInRoom(@Req() req, @Body() dto: {roomId: string}) {
  //   // const { id } = req.user;
  //   return this.roomService.findUserInRoom(dto.roomId, req.user.id);
  // }
}
