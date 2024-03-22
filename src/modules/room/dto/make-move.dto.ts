import { IsEnum, IsUUID } from 'class-validator';

import { RoomPlayerMoveEnum } from '../room.enums';

export class MakeMoveDTO {
  @IsUUID('4')
  roomId: string;

  @IsUUID('4')
  userId: string;

  @IsEnum(RoomPlayerMoveEnum)
  move: RoomPlayerMoveEnum;
}
