import { Request, IResponse } from "@renderer/utils";

export class UserApi {
  static login(account: string, password: string): IResponse<{ accessToken: string }> {
    return Request.post("/api/user/login", {
      account,
      password,
    });
  }
}
