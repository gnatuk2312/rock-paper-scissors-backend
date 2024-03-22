import { RoomPlayerInterface } from './room-player.interface';

export interface RoomInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  players: RoomPlayerInterface[];
}
