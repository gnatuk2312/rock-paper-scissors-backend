import { UserInterface } from 'src/modules/user/interface/user.interface';

export interface AuthInterface {
  accessToken: string;
  refreshToken: string;
  user: UserInterface;
}
