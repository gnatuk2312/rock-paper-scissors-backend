import { RefreshTokenDTO } from '../dto/refresh-token.dto';
import { SignUpDTO } from '../dto/sign-up.dto';
import { SignInDTO } from '../dto/sign-in.dto';
import { AuthInterface } from './auth.interface';

export interface AuthServiceInterface {
  signUp(dto: SignUpDTO): Promise<AuthInterface>;
  signIn(dto: SignInDTO): Promise<AuthInterface>;
  refreshToken(dto: RefreshTokenDTO): Promise<AuthInterface>;
}
