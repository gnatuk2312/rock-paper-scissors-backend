import { Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import {
  SocketSubscribeEventEnum,
  SocketEmitEventEnum,
} from './websocket.enums';
import { RoomEventEnum } from '../room.enums';
import { ROOM_WEBSOCKET_SESSIONS } from './websocket.constants';
import { RoomWebsocketSessions } from './websocket.sessions';
import { SocketInterface } from './interface/socket.interface';
import { RoomInterface } from '../interface/room.interface';

@Injectable()
@WebSocketGateway()
export class RoomWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(ROOM_WEBSOCKET_SESSIONS)
    private readonly websocketSessions: RoomWebsocketSessions,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  private handleBroadcastOnlineUsers() {
    const sessions = this.websocketSessions.getAll();

    this.server.emit(
      SocketEmitEventEnum.ONLINE_USERS,
      Array.from(sessions.keys()),
    );
  }

  handleConnection(socket: SocketInterface) {
    const userId = socket?.jwtPayload?.id;

    if (userId) this.websocketSessions.add(userId, socket);
    this.handleBroadcastOnlineUsers();
  }

  handleDisconnect(socket: SocketInterface) {
    const userId = socket?.jwtPayload?.id;

    this.websocketSessions.remove(userId);
    this.handleBroadcastOnlineUsers();
  }

  @OnEvent(RoomEventEnum.JOIN_ROOM_INVITE)
  handleJoinRoomInvite(data: { roomId: string; userIds: string[] }) {
    const { roomId, userIds } = data;

    userIds.forEach((userId) => {
      const session = this.websocketSessions.get(userId);
      session?.emit(SocketEmitEventEnum.JOIN_ROOM_INVITE, { roomId });
    });
  }

  @SubscribeMessage(SocketSubscribeEventEnum.JOIN_ROOM)
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: SocketInterface,
  ) {
    socket.join(`room-${data.roomId}`);
  }

  @OnEvent(RoomEventEnum.WINNER_DETERMINED)
  handleWinnerDetermined(data: { room: RoomInterface; message: string }) {
    this.server
      .to(`room-${data.room.id}`)
      .emit(SocketEmitEventEnum.WINNER_DETERMINED, data);
  }

  @SubscribeMessage(SocketSubscribeEventEnum.LEAVE_ROOM)
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: SocketInterface,
  ) {
    socket.leave(`room-${data.roomId}`);

    this.eventEmitter.emit(RoomEventEnum.LEAVE_ROOM, data.roomId);
  }
}
