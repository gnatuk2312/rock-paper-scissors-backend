import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AUTH_SERVICE, AUTH_MAPPER, TOKEN_SERVICE } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthMapper } from './auth.mapper';
import { TokenService } from './token.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule, forwardRef(() => UserModule)],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: AUTH_MAPPER,
      useClass: AuthMapper,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: TokenService,
    },
  ],
  controllers: [AuthController],
  exports: [TOKEN_SERVICE, JwtModule],
})
export class AuthModule {}
