import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { StoreContext, getStores } from "@/stores";
import { Routes } from "@/routes";
import { ThemeWrapper } from "@/components/theme/theme-wrapper";
import { ApolloProvider } from "@apollo/client";
import { SocketClientContext, socketClient, apolloClient } from "@/contexts";
import { AudioWrapper } from "./components/theme/audio-wrapper";
import "./i18n";

const stores = getStores();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <StoreContext.Provider value={stores}>
      <SocketClientContext.Provider value={socketClient}>
        <ThemeWrapper>
          <AudioWrapper>
            <Routes />
          </AudioWrapper>
        </ThemeWrapper>
      </SocketClientContext.Provider>
    </StoreContext.Provider>
  </ApolloProvider>,
);
