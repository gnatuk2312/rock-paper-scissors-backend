import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';

import { SocketInterface } from './interface/socket.interface';
import { TokenServiceInterface } from 'src/modules/auth/interface/token-service.interface';

export class RoomWebsocketAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly tokenService: TokenServiceInterface,
  ) {
    super(app);
  }

  private extractTokenFromSocket(socket: SocketInterface): string | undefined {
    const [type, token] =
      socket.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, {
      ...options,
      cors: { origin: '*' },
    });

    server.use(async (socket: SocketInterface, next) => {
      const accessToken = this.extractTokenFromSocket(socket);

      if (!accessToken) return next(new UnauthorizedException());

      try {
        const jwtPayload = this.tokenService.verifyAccessToken(accessToken);

        socket.jwtPayload = jwtPayload;
      } catch (error) {
        return next(new UnauthorizedException());
      }

      next();
    });

    return server;
  }
}
