import { Injectable } from '@nestjs/common';
import { Room, RoomId, MediasoupWorker } from 'src/types';

@Injectable()
export class RoomManager {
  private rooms: Room[] = [];

  getOrCreateRoom(roomId: RoomId, getWorker: () => MediasoupWorker) {
    console.log('rooms', this.rooms.length);
    let room = this.rooms.find((it) => it.roomId === roomId);
    if (!room) {
      const worker = getWorker();
      room = {
        roomId,
        workerId: worker.appData.id,
        sessions: [],
      };
      this.rooms.push(room);
    }

    return room;
  }
}
