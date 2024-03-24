import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';

import { UserServiceInterface } from './interface/user-service.interface';
import { USER_REPOSITORY } from './user.constants';
import { UserRepositoryInterface } from './interface/user-repository.interface';
import { User } from './entities/user.entity';
import { UserInterface } from './interface/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService implements UserServiceInterface {
  private readonly hashSalt = 5;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async create(dto: CreateUserDTO): Promise<UserInterface> {
    const isAlreadyExists = await this.userRepository.findByName(dto.name);

    if (isAlreadyExists) {
      throw new BadRequestException('This nickname is already taken');
    }

    dto.password = await hash(dto.password, this.hashSalt);

    const user = new User();

    user.name = dto.name;
    user.password = dto.password;

    return await this.userRepository.create(user);
  }

  public async findAll(): Promise<UserInterface[]> {
    return await this.userRepository.findAll();
  }

  public async findById(id: string): Promise<UserInterface> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  public async findByName(name: string): Promise<UserInterface> {
    return await this.userRepository.findByName(name);
  }
}
