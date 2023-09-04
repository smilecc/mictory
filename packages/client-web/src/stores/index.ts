import { useLocalObservable } from "mobx-react-lite";
import React, { useContext } from "react";
import { CommonStore } from "./CommonStore";
import { ChannelStore } from "./ChannelStore";

export interface IStores {
  commonStore: CommonStore;
  channelStore: ChannelStore;
}

let stores: IStores;

export function getStores(): IStores {
  if (!stores) {
    stores = {
      commonStore: new CommonStore(),
      channelStore: new ChannelStore(),
    };
  }

  return stores;
}

export const StoreContext = React.createContext<IStores>(getStores());

export const useCommonStore = () => {
  const stores = useContext(StoreContext);
  return useLocalObservable(() => stores.commonStore);
};

export const useChannelStore = () => {
  const stores = useContext(StoreContext);
  return useLocalObservable(() => stores.channelStore);
};
