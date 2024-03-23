export enum SocketSubscribeEvent {
  JOIN_ROOM = 'JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
}

export enum SocketEmitEvent {
  ONLINE_USERS = 'ONLINE_USERS',
  JOIN_ROOM_INVITE = 'JOIN_ROOM_INVITE',
  WINNER_DETERMINED = 'WINNER_DETERMINED',
}
