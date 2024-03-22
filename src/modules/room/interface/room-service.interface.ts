import { DeleteResult } from 'typeorm';

import { RoomInterface } from './room.interface';
import { CreateRoomDTO } from '../dto/create-room.dto';
import { MakeMoveDTO } from '../dto/make-move.dto';

export interface RoomServiceInterface {
  create(dto: CreateRoomDTO): Promise<RoomInterface>;
  delete(id: string): Promise<DeleteResult>;
  join(id: string, userId: string): Promise<RoomInterface>;
  makeMove(dto: MakeMoveDTO): Promise<RoomInterface>;
}
