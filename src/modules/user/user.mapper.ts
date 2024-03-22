import { Injectable } from '@nestjs/common';

import { UserMapperInterface } from './interface/user-mapper.interface';
import { UserDTO } from './dto/user.dto';
import { UserInterface } from './interface/user.interface';

@Injectable()
export class UserMapper implements UserMapperInterface {
  public mapToUserDTO(entity: UserInterface): UserDTO {
    const dto = new UserDTO();

    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.name = entity.name;

    return dto;
  }

  public mapAllToUserDTO(entities: UserInterface[]): UserDTO[] {
    return entities.map((entity) => this.mapToUserDTO(entity));
  }
}
