import { Inject, Injectable } from '@nestjs/common';

import { RoomMapperInterface } from './interface/room-mapper.interface';
import { RoomDTO } from './dto/room.dto';
import { RoomInterface } from './interface/room.interface';
import { RoomPlayerInterface } from './interface/room-player.interface';
import { RoomPlayerDTO } from './dto/room-player.dto';
import { USER_MAPPER } from '../user/user.constants';
import { UserMapperInterface } from '../user/interface/user-mapper.interface';

@Injectable()
export class RoomMapper implements RoomMapperInterface {
  constructor(
    @Inject(USER_MAPPER) private readonly userMapper: UserMapperInterface,
  ) {}

  public mapToRoomDTO(entity: RoomInterface): RoomDTO {
    const dto = new RoomDTO();

    dto.id = entity.id;
    dto.players = this.mapAllToRoomPlayerDTO(entity.players);

    return dto;
  }

  private mapToRoomPlayerDTO(entity: RoomPlayerInterface): RoomPlayerDTO {
    const dto = new RoomPlayerDTO();

    dto.id = entity.id;
    dto.score = entity.score;
    dto.user = this.userMapper.mapToUserDTO(entity.user);

    return dto;
  }

  private mapAllToRoomPlayerDTO(
    entities: RoomPlayerInterface[],
  ): RoomPlayerDTO[] {
    return entities.map((entity) => this.mapToRoomPlayerDTO(entity));
  }
}
