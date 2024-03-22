import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { USER_MAPPER, USER_SERVICE } from './user.constants';
import { UserServiceInterface } from './interface/user-service.interface';
import { UserMapperInterface } from './interface/user-mapper.interface';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserServiceInterface,
    @Inject(USER_MAPPER) private readonly userMapper: UserMapperInterface,
  ) {}

  @Get()
  public async findAll(): Promise<UserDTO[]> {
    const users = await this.userService.findAll();

    return this.userMapper.mapAllToUserDTO(users);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  public async findById(@Param('id') id: string): Promise<UserDTO> {
    const user = await this.userService.findById(id);

    return this.userMapper.mapToUserDTO(user);
  }
}
