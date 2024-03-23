import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from './entities/room.entity';
import { RoomPlayer } from './entities/room-player.entity';
import { AuthModule } from '../auth/auth.module';
import { RoomWebsocketModule } from './websocket/websocket.module';
import { UserModule } from '../user/user.module';
import { ROOM_MAPPER, ROOM_REPOSITORY, ROOM_SERVICE } from './room.constants';
import { RoomRepository } from './room.repository';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomMapper } from './room.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomPlayer]),
    UserModule,
    AuthModule,
    RoomWebsocketModule,
  ],
  providers: [
    {
      provide: ROOM_REPOSITORY,
      useClass: RoomRepository,
    },
    {
      provide: ROOM_SERVICE,
      useClass: RoomService,
    },
    {
      provide: ROOM_MAPPER,
      useClass: RoomMapper,
    },
  ],
  controllers: [RoomController],
  exports: [ROOM_SERVICE],
})
export class RoomModule {}
