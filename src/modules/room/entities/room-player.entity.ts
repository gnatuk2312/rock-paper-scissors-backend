import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoomPlayerInterface } from '../interface/room-player.interface';
import { RoomInterface } from '../interface/room.interface';
import { RoomPlayerMoveEnum } from '../room.enums';
import { Room } from './room.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserInterface } from 'src/modules/user/interface/user.interface';

@Entity('room_players')
export class RoomPlayer implements RoomPlayerInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'smallint', default: 0 })
  score: number;

  @Column({ type: 'enum', enum: RoomPlayerMoveEnum, nullable: true })
  move: RoomPlayerMoveEnum | null;

  @ManyToOne(() => Room, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  room: RoomInterface;

  @OneToOne(() => User, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserInterface;
}
