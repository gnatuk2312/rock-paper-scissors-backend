import { Socket } from 'socket.io';

import { JWTPayloadInterface } from 'src/modules/auth/interface/jwt-payload.interface';

export interface SocketInterface extends Socket {
  jwtPayload?: JWTPayloadInterface;
}
