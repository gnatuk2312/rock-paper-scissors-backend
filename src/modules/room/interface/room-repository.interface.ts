import { DeleteResult } from 'typeorm';

import { RoomInterface } from './room.interface';

export interface RoomRepositoryInterface {
  create(entity: RoomInterface): Promise<RoomInterface>;
  update(entity: RoomInterface): Promise<RoomInterface>;
  delete(id: string): Promise<DeleteResult>;
  findById(id: string): Promise<RoomInterface>;
}
