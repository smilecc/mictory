import { makeAutoObservable } from "mobx";
import { Session } from "@renderer/session";

export const STORAGE_ACCESS_TOKEN = "_access_token";

export class CommonStore {
  accessToken: string | null;
  session: Session;

  constructor() {
    makeAutoObservable(this);
    this.accessToken = window.localStorage.getItem(STORAGE_ACCESS_TOKEN);

    this.session = new Session("wss://rocket.smilec.cc/ws");
    console.log(1);
  }

  setAccessToken(accessToken: string) {
    window.localStorage.setItem(STORAGE_ACCESS_TOKEN, accessToken);
    this.accessToken = accessToken;
  }
}
