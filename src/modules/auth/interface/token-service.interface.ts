import { UserInterface } from 'src/modules/user/interface/user.interface';
import { JWTPayloadInterface } from './jwt-payload.interface';

export interface TokenServiceInterface {
  signTokens(user: UserInterface): {
    accessToken: string;
    refreshToken: string;
  };
  verifyAccessToken(token: string): JWTPayloadInterface;
  verifyRefreshToken(token: string): JWTPayloadInterface;
}
