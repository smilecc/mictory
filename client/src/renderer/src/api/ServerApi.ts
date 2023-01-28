import { Request, IResponse } from "@renderer/utils";
import { IUserServer, IServerRoom, IServerUser } from "./entities";

export class ServerApi {
  static listUserServers(): IResponse<IUserServer[]> {
    return Request.get("/api/user/servers");
  }

  static listServerRooms(serverId: number): IResponse<IServerRoom[]> {
    return Request.get(`/api/server/${serverId}/rooms`);
  }

  static listServerUsers(serverId: number): IResponse<IServerUser[]> {
    return Request.get(`/api/server/${serverId}/users`);
  }
}