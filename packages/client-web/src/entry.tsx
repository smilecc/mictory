/* eslint-disable react-refresh/only-export-components */
import React from "react";
import "./index.css";
import { Routes } from "@/routes";
import { ThemeWrapper } from "@/components/theme/theme-wrapper";
import { AudioWrapper } from "./components/theme/audio-wrapper";
import "./i18n";

export const App: React.FC = () => {
  return (
    <ThemeWrapper>
      <AudioWrapper>
        <Routes />
      </AudioWrapper>
    </ThemeWrapper>
  );
};

export { SocketClientContext, createApolloClient, createSocketClient, setImageHost } from "@/contexts";
export { StoreContext, getStores } from "@/stores";
export { ApolloProvider } from "@apollo/client";
export { API_HOST, createApiAxios } from "@/utils";

export default App;
