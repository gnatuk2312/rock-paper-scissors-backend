import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { appConfig, databaseConfig, jwtConfig } from './config';
import { DatabaseProvider } from './providers';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    EventEmitterModule.forRoot(),
    DatabaseProvider,
    AuthModule,
    UserModule,
    RoomModule,
  ],
})
export class AppModule {}
