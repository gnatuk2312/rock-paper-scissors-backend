import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RoomRepositoryInterface } from './interface/room-repository.interface';
import { Room } from './entities/room.entity';
import { RoomInterface } from './interface/room.interface';

export class RoomRepository implements RoomRepositoryInterface {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  public async create(entity: RoomInterface): Promise<RoomInterface> {
    return await this.roomRepository.save(entity);
  }

  public async update(entity: RoomInterface): Promise<RoomInterface> {
    return await this.roomRepository.save(entity);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.roomRepository.delete(id);
  }

  public async findById(id: string): Promise<RoomInterface> {
    return await this.roomRepository.findOne({ where: { id } });
  }
}
