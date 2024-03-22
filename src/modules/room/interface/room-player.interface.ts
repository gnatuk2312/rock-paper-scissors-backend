import { RoomPlayerMoveEnum } from '../room.enums';
import { RoomInterface } from './room.interface';
import { UserInterface } from 'src/modules/user/interface/user.interface';

export interface RoomPlayerInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  score: number;
  move: RoomPlayerMoveEnum | null;
  room: RoomInterface;
  user: UserInterface;
}
