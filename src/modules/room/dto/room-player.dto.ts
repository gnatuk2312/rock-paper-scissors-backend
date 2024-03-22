import { UserDTO } from 'src/modules/user/dto/user.dto';

export class RoomPlayerDTO {
  id: string;
  score: number;
  user: UserDTO;
}
