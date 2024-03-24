import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoomInterface } from '../interface/room.interface';
import { RoomPlayer } from './room-player.entity';
import { RoomPlayerInterface } from '../interface/room-player.interface';

@Entity('rooms')
export class Room implements RoomInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => RoomPlayer, (roomPlayer) => roomPlayer.room, {
    cascade: true,
    eager: true,
  })
  players: RoomPlayerInterface[];
}
