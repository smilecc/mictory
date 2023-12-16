import { StoreStorage } from "@/lib/store-storage";
import { CommonStore } from "@/stores/CommonStore";
import React from "react";
import { ManagerOptions, SocketOptions, io } from "socket.io-client";
export * from "./apollo";

const SOCKET_URL = import.meta.env.DEV ? "http://localhost:3000" : undefined;

const SOCKET_OPTIONS: Partial<ManagerOptions & SocketOptions> = {
  autoConnect: false,
  auth(cb) {
    const token = StoreStorage.load(CommonStore, "sessionToken", "");
    console.log("auth cb", token);
    cb({
      token,
    });
  },
};

export const socketClient = (() => {
  if (SOCKET_URL) return io(SOCKET_URL, SOCKET_OPTIONS);
  return io(SOCKET_OPTIONS);
})();

export const SocketClientContext = React.createContext(socketClient);
