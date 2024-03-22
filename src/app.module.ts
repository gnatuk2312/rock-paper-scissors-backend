import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, databaseConfig, jwtConfig } from './config';
import { DatabaseProvider } from './providers';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    DatabaseProvider,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
