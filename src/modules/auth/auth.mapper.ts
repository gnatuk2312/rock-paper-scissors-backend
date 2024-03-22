import { Inject, Injectable } from '@nestjs/common';

import { AuthMapperInterface } from './interface/auth-mapper.interface';
import { AuthInterface } from './interface/auth.interface';
import { AuthDTO } from './dto/auth.dto';
import { USER_MAPPER } from '../user/user.constants';
import { UserMapperInterface } from '../user/interface/user-mapper.interface';

@Injectable()
export class AuthMapper implements AuthMapperInterface {
  constructor(
    @Inject(USER_MAPPER) private readonly userMapper: UserMapperInterface,
  ) {}

  public mapToAuthDTO(entity: AuthInterface): AuthDTO {
    const dto = new AuthDTO();

    dto.accessToken = entity.accessToken;
    dto.refreshToken = entity.refreshToken;
    dto.user = this.userMapper.mapToUserDTO(entity.user);

    return dto;
  }
}
