import { SocketInterface } from './socket.interface';

export interface RoomWebsocketSessionsInterface {
  add(userId: string, socket: SocketInterface): void;
  remove(userId: string): void;
  get(userId: string): SocketInterface;
  getAll(): Map<string, SocketInterface>;
}
