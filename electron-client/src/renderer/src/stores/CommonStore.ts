import { makeAutoObservable } from "mobx";
import { Session } from "@renderer/session";

export class CommonStore {
  constructor() {
    makeAutoObservable(this);
    new Session("wss://rocket.smilec.cc/ws");
    console.log(1);
  }
}
