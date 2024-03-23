import { Inject, Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WebsocketEvent } from './websocket.enums';
import { SocketInterface } from './interface/socket.interface';
import { ROOM_WEBSOCKET_SESSIONS } from './websocket.constants';
import { RoomWebsocketSessions } from './websocket.sessions';

@Injectable()
@WebSocketGateway()
export class RoomWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(ROOM_WEBSOCKET_SESSIONS)
    private readonly websocketSessions: RoomWebsocketSessions,
  ) {}

  @WebSocketServer()
  server: Server;

  private handleBroadcastOnlineUsers() {
    const sessions = this.websocketSessions.getAll();

    this.server.emit(WebsocketEvent.ONLINE_USERS, Array.from(sessions.keys()));
  }

  public handleConnection(socket: SocketInterface) {
    const userId = socket?.jwtPayload?.id;

    if (userId) this.websocketSessions.add(userId, socket);
    this.handleBroadcastOnlineUsers();
  }

  public handleDisconnect(socket: SocketInterface) {
    const userId = socket?.jwtPayload?.id;

    this.websocketSessions.remove(userId);
    this.handleBroadcastOnlineUsers();
  }
}
