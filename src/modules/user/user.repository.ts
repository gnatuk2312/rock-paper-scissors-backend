import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRepositoryInterface } from './interface/user-repository.interface';
import { User } from './entities/user.entity';
import { UserInterface } from './interface/user.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async create(entity: UserInterface): Promise<UserInterface> {
    return await this.userRepository.save(entity);
  }

  public async findAll(): Promise<UserInterface[]> {
    return await this.userRepository.find();
  }

  public async findById(id: string): Promise<UserInterface> {
    return await this.userRepository.findOne({ where: { id } });
  }

  public async findByName(name: string): Promise<UserInterface> {
    return await this.userRepository.findOne({ where: { name } });
  }
}
