import { makeAutoObservable } from "mobx";
import { StoreStorage } from "@/lib/store-storage";
import type { ThemeDarkMode } from "@/types";

export class CommonStore {
  constructor() {
    makeAutoObservable(this);

    this.themeDarkMode = StoreStorage.load(this, "themeDarkMode", "light");
  }

  themeDarkMode: ThemeDarkMode = "light";

  setThemeDarkMode(darkMode: ThemeDarkMode) {
    this.themeDarkMode = StoreStorage.save(this, "themeDarkMode", darkMode);
  }
}
