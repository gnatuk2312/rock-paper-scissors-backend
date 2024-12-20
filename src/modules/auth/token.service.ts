import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenServiceInterface } from './interface/token-service.interface';
import { UserInterface } from '../user/interface/user.interface';
import { JWTPayloadInterface } from './interface/jwt-payload.interface';

@Injectable()
export class TokenService implements TokenServiceInterface {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.accessTokenSecret = this.configService.get('jwt.accessTokenSecret');
    this.refreshTokenSecret = this.configService.get('jwt.refreshTokenSecret');
  }

  private createJWTPayload(user: UserInterface): JWTPayloadInterface {
    return { id: user.id, name: user.name };
  }

  private signAccessToken(payload: JWTPayloadInterface): string {
    return this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: '3h',
    });
  }

  private signRefreshToken(payload: JWTPayloadInterface): string {
    return this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: '7d',
    });
  }

  public signTokens(user: UserInterface): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = this.createJWTPayload(user);
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  public verifyAccessToken(token: string): JWTPayloadInterface {
    try {
      return this.jwtService.verify(token, { secret: this.accessTokenSecret });
    } catch (error) {
      throw new UnauthorizedException('Access token is not valid');
    }
  }

  public verifyRefreshToken(token: string): JWTPayloadInterface {
    try {
      return this.jwtService.verify(token, { secret: this.refreshTokenSecret });
    } catch (error) {
      throw new UnauthorizedException('Refresh token is not valid');
    }
  }
}
