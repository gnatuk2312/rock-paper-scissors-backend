import { RoomDTO } from '../dto/room.dto';
import { RoomInterface } from './room.interface';

export interface RoomMapperInterface {
  mapToRoomDTO(entity: RoomInterface): RoomDTO;
}
