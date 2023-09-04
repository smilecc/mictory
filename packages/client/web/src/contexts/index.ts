import { StoreStorage } from "@/lib/store-storage";
import { CommonStore } from "@/stores/CommonStore";
import React from "react";
import { io } from "socket.io-client";
export * from "./apollo";

export const socketClient = io("http://38.147.170.48:3000", {
  autoConnect: false,
  auth(cb) {
    const token = StoreStorage.load(CommonStore, "sessionToken", "");
    console.log("auth cb", token);
    cb({
      token,
    });
  },
});

export const SocketClientContext = React.createContext(socketClient);
