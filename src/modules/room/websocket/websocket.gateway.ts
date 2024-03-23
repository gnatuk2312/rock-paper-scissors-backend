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

import { SocketSubscribeEvent, SocketEmitEvent } from './websocket.enums';
import { SocketInterface } from './interface/socket.interface';
import { ROOM_WEBSOCKET_SESSIONS } from './websocket.constants';
import { RoomWebsocketSessions } from './websocket.sessions';
import { RoomInterface } from '../interface/room.interface';
import { RoomEmitterEvent } from '../room.enums';

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

    this.server.emit(SocketEmitEvent.ONLINE_USERS, Array.from(sessions.keys()));
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

  @OnEvent(RoomEmitterEvent.JOIN_ROOM_INVITE)
  handleJoinRoomInvite(data: { roomId: string; userIds: string[] }) {
    const { roomId, userIds } = data;

    userIds.forEach((userId) => {
      const session = this.websocketSessions.get(userId);
      session?.emit(SocketEmitEvent.JOIN_ROOM_INVITE, { roomId });
    });
  }

  @SubscribeMessage(SocketSubscribeEvent.JOIN_ROOM)
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: SocketInterface,
  ) {
    socket.join(`room-${data.roomId}`);
  }

  @OnEvent(RoomEmitterEvent.WINNER_DETERMINED)
  handleWinnerDetermined(data: { room: RoomInterface; message: string }) {
    this.server
      .to(`room-${data.room.id}`)
      .emit(SocketEmitEvent.WINNER_DETERMINED, data);
  }

  @SubscribeMessage(SocketSubscribeEvent.LEAVE_ROOM)
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: SocketInterface,
  ) {
    const { roomId } = data;

    socket.leave(`room-${roomId}`);

    this.eventEmitter.emit(RoomEmitterEvent.LEAVE_ROOM, roomId);
  }
}
