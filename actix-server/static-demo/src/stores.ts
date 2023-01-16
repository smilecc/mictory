import { defineStore } from "pinia";
import { Session } from "./session";

export const useStore = defineStore("main", {
  state: () => {
    return {
      session: new Session(new WebSocket("wss://rocket.smilec.cc/ws")),
    };
  },
});
