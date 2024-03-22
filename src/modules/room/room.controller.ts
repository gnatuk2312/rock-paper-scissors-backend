import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { AuthGuard } from '../auth/auth.guard';
import { GetUserId } from 'src/decorators/get-user-id.decorator';
import { ROOM_MAPPER, ROOM_SERVICE } from './room.constants';
import { RoomServiceInterface } from './interface/room-service.interface';
import { RoomMapperInterface } from './interface/room-mapper.interface';
import { RoomDTO } from './dto/room.dto';
import { CreateRoomDTO } from './dto/create-room.dto';
import { MakeMoveDTO } from './dto/make-move.dto';

@UseGuards(AuthGuard)
@Controller('rooms')
export class RoomController {
  constructor(
    @Inject(ROOM_SERVICE) private readonly roomService: RoomServiceInterface,
    @Inject(ROOM_MAPPER) private readonly roomMapper: RoomMapperInterface,
  ) {}

  @Post()
  public async create(@Body() dto: CreateRoomDTO): Promise<RoomDTO> {
    const room = await this.roomService.create(dto);

    return this.roomMapper.mapToRoomDTO(room);
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.roomService.delete(id);
  }

  @Get('/join/:id')
  public async join(
    @Param('id') id: string,
    @GetUserId() userId: string,
  ): Promise<RoomDTO> {
    const room = await this.roomService.join(id, userId);

    return this.roomMapper.mapToRoomDTO(room);
  }

  @Patch('/make-move')
  public async makeMove(@Body() dto: MakeMoveDTO): Promise<RoomDTO> {
    const room = await this.roomService.makeMove(dto);

    return this.roomMapper.mapToRoomDTO(room);
  }
}
