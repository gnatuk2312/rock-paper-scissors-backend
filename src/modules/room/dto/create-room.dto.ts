import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateRoomPlayerDTO {
  @IsUUID('4')
  userId: string;
}

export class CreateRoomDTO {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateRoomPlayerDTO)
  players: CreateRoomPlayerDTO[];
}
