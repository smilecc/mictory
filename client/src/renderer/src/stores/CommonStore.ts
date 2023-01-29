import { makeAutoObservable, runInAction } from "mobx";
import { Session } from "@renderer/session";
import { IUserInfo, UserApi } from "@renderer/api";

export const STORAGE_ACCESS_TOKEN = "_access_token";
export const STORAGE_USER_ID = "_user_id";

export class CommonStore {
  accessToken: string | null;
  session: Session;
  userInfo: IUserInfo | null = null;
  viewServerId: number = 0;
  joinedServerId: number = 0;

  constructor() {
    makeAutoObservable(this);
    this.accessToken = window.localStorage.getItem(STORAGE_ACCESS_TOKEN);
    this.session = new Session("wss://rocket.smilec.cc/ws");
    this.loadUserInfo();
  }

  setAccessToken(accessToken: string) {
    window.localStorage.setItem(STORAGE_ACCESS_TOKEN, accessToken);
    this.accessToken = accessToken;
  }

  loadUserInfo() {
    UserApi.getUserInfo(0).then(({ data }) => {
      runInAction(() => {
        this.userInfo = data.data;
      });
    });
  }
}
