import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { USER_REPOSITORY, USER_SERVICE, USER_MAPPER } from './user.constants';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserMapper } from './user.mapper';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    {
      provide: USER_MAPPER,
      useClass: UserMapper,
    },
  ],
  controllers: [UserController],
  exports: [USER_SERVICE, USER_MAPPER],
})
export class UserModule {}
