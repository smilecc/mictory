import { makeAutoObservable } from "mobx";
import { StoreStorage } from "@/lib/store-storage";
import type { ThemeDarkMode } from "@/types";

export class CommonStore {
  constructor() {
    makeAutoObservable(this);

    this.themeDarkMode = StoreStorage.load(CommonStore, "themeDarkMode", "light");
    this._sessionToken = StoreStorage.load(CommonStore, "sessionToken", "");
  }

  themeDarkMode: ThemeDarkMode = "light";
  private _sessionToken: string = "";

  setThemeDarkMode(darkMode: ThemeDarkMode) {
    this.themeDarkMode = StoreStorage.save(CommonStore, "themeDarkMode", darkMode);
  }

  get sessionToken() {
    return this._sessionToken;
  }

  set sessionToken(token: string) {
    this._sessionToken = StoreStorage.save(CommonStore, "sessionToken", token);
  }
}
