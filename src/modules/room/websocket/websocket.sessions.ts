import { SocketInterface } from './interface/socket.interface';
import { RoomWebsocketSessionsInterface } from './interface/websocket-sessions.interface';

export class RoomWebsocketSessions implements RoomWebsocketSessionsInterface {
  private readonly sessions = new Map<string, SocketInterface>();

  public add(userId: string, socket: SocketInterface): void {
    this.sessions.set(userId, socket);
  }

  public remove(userId: string): void {
    this.sessions.delete(userId);
  }

  public get(userId: string): SocketInterface {
    return this.sessions.get(userId);
  }

  public getAll(): Map<string, SocketInterface> {
    return this.sessions;
  }
}
