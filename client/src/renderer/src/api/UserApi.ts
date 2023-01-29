import { Request, IResponse } from "@renderer/utils";
import { IUserInfo } from "./entities";

export class UserApi {
  static login(
    account: string,
    password: string
  ): IResponse<{ accessToken: string; userId: number }> {
    return Request.post("/api/user/login", {
      account,
      password,
    });
  }

  static getUserInfo(id: string | number): IResponse<IUserInfo | null> {
    return Request.get(`/api/user/${id}`);
  }
}
