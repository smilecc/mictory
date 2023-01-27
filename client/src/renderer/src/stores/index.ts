import { useLocalObservable } from "mobx-react-lite";
import React, { useContext } from "react";
import { CommonStore } from "./CommonStore";

export interface IStores {
  commonStore: CommonStore;
}

let stores: IStores;

export function getStores(): IStores {
  if (!stores) {
    stores = {
      commonStore: new CommonStore(),
    };
  }

  return stores;
}

export const StoreContext = React.createContext<IStores>({} as any);

export const useCommonStore = () => {
  const stores = useContext(StoreContext);
  return useLocalObservable(() => stores.commonStore);
};
