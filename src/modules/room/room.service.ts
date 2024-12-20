import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { RoomServiceInterface } from './interface/room-service.interface';
import { CreateRoomDTO } from './dto/create-room.dto';
import { MakeMoveDTO } from './dto/make-move.dto';
import { RoomInterface } from './interface/room.interface';
import { ROOM_REPOSITORY } from './room.constants';
import { RoomRepository } from './room.repository';
import { RoomPlayer } from './entities/room-player.entity';
import { USER_SERVICE } from '../user/user.constants';
import { UserServiceInterface } from '../user/interface/user-service.interface';
import { Room } from './entities/room.entity';
import { RoomPlayerInterface } from './interface/room-player.interface';
import { RoomEventEnum, RoomPlayerMoveEnum } from './room.enums';

@Injectable()
export class RoomService implements RoomServiceInterface {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepository: RoomRepository,
    @Inject(USER_SERVICE) private readonly userService: UserServiceInterface,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async create(dto: CreateRoomDTO): Promise<RoomInterface> {
    const room = new Room();

    const users = await Promise.all(
      dto.players.map(({ userId }) => {
        return this.userService.findById(userId);
      }),
    );

    room.players = users.map((user) => {
      const roomPlayer = new RoomPlayer();
      roomPlayer.user = user;

      return roomPlayer;
    });

    const response = await this.roomRepository.create(room);

    this.eventEmitter.emit(RoomEventEnum.JOIN_ROOM_INVITE, {
      roomId: response.id,
      userIds: response.players.map((player) => player.user.id),
    });

    return response;
  }

  @OnEvent(RoomEventEnum.LEAVE_ROOM)
  public async delete(id: string): Promise<DeleteResult> {
    return await this.roomRepository.delete(id);
  }

  private async findById(id: string): Promise<RoomInterface> {
    const room = await this.roomRepository.findById(id);

    if (!room) throw new NotFoundException();

    return room;
  }

  private findRoomPlayerIndexByUserId(
    userId: string,
    room: RoomInterface,
  ): number {
    return room.players.findIndex((player) => player.user.id === userId);
  }

  public async join(id: string, userId: string): Promise<RoomInterface> {
    const room = await this.findById(id);

    if (this.findRoomPlayerIndexByUserId(userId, room) === -1) {
      throw new ForbiddenException();
    }

    return room;
  }

  private isAllUsersMadeMove(players: RoomPlayerInterface[]): boolean {
    return players.every((player) => player.move !== null);
  }

  private async incrementScoreForWinner(
    roomId: string,
    winnerMove: RoomPlayerMoveEnum,
  ): Promise<RoomInterface> {
    const room = await this.findById(roomId);

    room.players = room.players.map((player) => {
      if (player.move === winnerMove) player.score++;
      return player;
    });

    return await this.roomRepository.update(room);
  }

  private async determineWinner(roomId: string): Promise<void> {
    const room = await this.findById(roomId);
    const { id, players } = room;

    const movesCount: Record<RoomPlayerMoveEnum, number> = {
      [RoomPlayerMoveEnum.ROCK]: 0,
      [RoomPlayerMoveEnum.PAPER]: 0,
      [RoomPlayerMoveEnum.SCISSORS]: 0,
    };

    for (const player of players) {
      movesCount[player.move]++;
    }

    const numberOfPlayers = players.length;

    // All players make the same move (result: TIE)
    if (
      movesCount[RoomPlayerMoveEnum.ROCK] === numberOfPlayers ||
      movesCount[RoomPlayerMoveEnum.PAPER] === numberOfPlayers ||
      movesCount[RoomPlayerMoveEnum.SCISSORS] === numberOfPlayers
    ) {
      const room = await this.findById(roomId);

      this.eventEmitter.emit(RoomEventEnum.WINNER_DETERMINED, {
        room,
        message: "It's a tie!",
      });

      return;
    }

    // All players make all possible moves (result: TIE)
    if (
      movesCount[RoomPlayerMoveEnum.ROCK] > 0 &&
      movesCount[RoomPlayerMoveEnum.PAPER] > 0 &&
      movesCount[RoomPlayerMoveEnum.SCISSORS] > 0
    ) {
      const room = await this.findById(roomId);

      this.eventEmitter.emit(RoomEventEnum.WINNER_DETERMINED, {
        room,
        message: "It's a tie!",
      });

      return;
    }

    // Rock vs Paper (result: PAPER)
    if (
      movesCount[RoomPlayerMoveEnum.ROCK] > 0 &&
      movesCount[RoomPlayerMoveEnum.PAPER] > 0
    ) {
      const room = await this.incrementScoreForWinner(
        id,
        RoomPlayerMoveEnum.PAPER,
      );

      this.eventEmitter.emit(RoomEventEnum.WINNER_DETERMINED, {
        room,
        message: 'Paper wins!',
      });

      return;
    }

    // Paper vs Scissors (result: SCISSORS)
    if (
      movesCount[RoomPlayerMoveEnum.PAPER] > 0 &&
      movesCount[RoomPlayerMoveEnum.SCISSORS] > 0
    ) {
      const room = await this.incrementScoreForWinner(
        id,
        RoomPlayerMoveEnum.SCISSORS,
      );

      this.eventEmitter.emit(RoomEventEnum.WINNER_DETERMINED, {
        room,
        message: 'Scissors wins!',
      });

      return;
    }

    // Rock vs Scissors (result: ROCK)
    if (
      movesCount[RoomPlayerMoveEnum.ROCK] > 0 &&
      movesCount[RoomPlayerMoveEnum.SCISSORS] > 0
    ) {
      const room = await this.incrementScoreForWinner(
        id,
        RoomPlayerMoveEnum.ROCK,
      );

      this.eventEmitter.emit(RoomEventEnum.WINNER_DETERMINED, {
        room,
        message: 'Rock wins!',
      });

      return;
    }

    // Base case (result: TIE)
    this.eventEmitter.emit(RoomEventEnum.WINNER_DETERMINED, {
      room,
      message: "It's a tie!",
    });

    return;
  }

  private async resetRoomPlayersMove(roomId: string): Promise<RoomInterface> {
    const room = await this.findById(roomId);

    room.players = room.players.map((player) => {
      player.move = null;
      return player;
    });

    return await this.roomRepository.update(room);
  }

  public async makeMove(dto: MakeMoveDTO): Promise<RoomInterface> {
    const { roomId, userId, move } = dto;

    const room = await this.findById(roomId);
    const roomPlayerIndex = this.findRoomPlayerIndexByUserId(userId, room);

    if (roomPlayerIndex === -1) throw new ForbiddenException();

    room.players[roomPlayerIndex].move = move;

    const updatedRoom = await this.roomRepository.update(room);

    if (this.isAllUsersMadeMove(updatedRoom.players)) {
      await this.determineWinner(room.id);
      return await this.resetRoomPlayersMove(room.id);
    }

    return updatedRoom;
  }
}
