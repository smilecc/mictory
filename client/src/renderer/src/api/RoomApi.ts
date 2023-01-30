import { Request, IResponse } from "@renderer/utils";
import { IServerRoom } from "./entities";

export class RoomApi {
  static createRoom(serverId: number, name: string): IResponse<IServerRoom> {
    return Request.post(`/api/server/${serverId}/room`, {
      name,
    });
  }
}
