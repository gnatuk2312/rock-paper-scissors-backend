import { UserDTO } from 'src/modules/user/dto/user.dto';

export class AuthDTO {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}
