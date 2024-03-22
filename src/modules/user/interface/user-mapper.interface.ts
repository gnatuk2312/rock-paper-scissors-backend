import { UserDTO } from '../dto/user.dto';
import { UserInterface } from './user.interface';

export interface UserMapperInterface {
  mapToUserDTO(entity: UserInterface): UserDTO;
  mapAllToUserDTO(entities: UserInterface[]): UserDTO[];
}
