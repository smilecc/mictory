import { defineStore } from "pinia";
import { Session } from "./session";

export const useStore = defineStore("main", {
  state: () => {
    return {
      session: new Session(new WebSocket(`ws://${window.location.host}/ws`)),
    };
  },
});
