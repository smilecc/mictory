import { StoreStorage } from "@/lib/store-storage";
import { CommonStore } from "@/stores/CommonStore";
import React from "react";
import { io } from "socket.io-client";
import type { ManagerOptions, SocketOptions, Socket } from "socket.io-client";
export * from "./apollo";

const SOCKET_URL = import.meta.env.DEV ? "http://localhost:3000" : undefined;

let socketClient: Socket | null = null;

export function createSocketClient(socketUrl = SOCKET_URL): Socket {
  const options: Partial<ManagerOptions & SocketOptions> = {
    autoConnect: false,
    auth(cb) {
      const token = StoreStorage.load(CommonStore, "sessionToken", "");
      console.log("auth cb", token);
      cb({
        token,
      });
    },
  };

  socketClient = socketUrl ? io(socketUrl, options) : io(options);
  console.log(socketClient);
  return socketClient;
}

export function getSocketClient(): Socket {
  return socketClient!;
}

export const SocketClientContext: React.Context<Socket> = React.createContext<Socket>(null as unknown as Socket);
