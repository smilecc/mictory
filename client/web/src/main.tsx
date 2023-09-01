import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { StoreContext, getStores } from "@/stores";
import { Routes } from "@/routes";
import { ThemeWrapper } from "@/components/theme/theme-wrapper";
import { ApolloProvider } from "@apollo/client";
import { SocketClientContext, socketClient, apolloClient } from "@/contexts";

const stores = getStores();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <StoreContext.Provider value={stores}>
        <SocketClientContext.Provider value={socketClient}>
          <ThemeWrapper>
            <Routes />
          </ThemeWrapper>
        </SocketClientContext.Provider>
      </StoreContext.Provider>
    </ApolloProvider>
  </React.StrictMode>,
);
