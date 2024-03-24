import { Module } from '@nestjs/common';

import { RoomWebsocketGateway } from './websocket.gateway';
import {
  ROOM_WEBSOCKET_GATEWAY,
  ROOM_WEBSOCKET_SESSIONS,
} from './websocket.constants';
import { RoomWebsocketSessions } from './websocket.sessions';

@Module({
  providers: [
    {
      provide: ROOM_WEBSOCKET_GATEWAY,
      useClass: RoomWebsocketGateway,
    },
    {
      provide: ROOM_WEBSOCKET_SESSIONS,
      useClass: RoomWebsocketSessions,
    },
  ],
})
export class RoomWebsocketModule {}
