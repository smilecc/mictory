import { makeAutoObservable } from "mobx";
import { StoreStorage } from "@/lib/store-storage";
import type { ThemeDarkMode } from "@/types";
import { FetchCurrentUserQuery } from "@/@generated/graphql";

export class CommonStore {
  constructor() {
    makeAutoObservable(this);
  }

  settingModalPath?: string;

  themeDarkMode: ThemeDarkMode = StoreStorage.load(CommonStore, "themeDarkMode", "dark");
  private _sessionToken: string = StoreStorage.load(CommonStore, "sessionToken", "");

  setThemeDarkMode(darkMode: ThemeDarkMode) {
    this.themeDarkMode = StoreStorage.save(CommonStore, "themeDarkMode", darkMode);
  }

  get sessionToken() {
    return this._sessionToken;
  }

  set sessionToken(token: string) {
    this._sessionToken = StoreStorage.save(CommonStore, "sessionToken", token);
  }

  get isLogin() {
    return !!this._sessionToken;
  }

  get isNotLogin() {
    return !this.isLogin;
  }

  user: FetchCurrentUserQuery["user"];
  loginRedirect?: string;
}
