import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { StoreContext, getStores } from "@/stores";
import { Routes } from "@/routes";
import { ThemeWrapper } from "@/components/theme/theme-wrapper";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { SocketClientContext, socketClient } from "@/contexts";

const stores = getStores();

export const client = new ApolloClient({
  uri: "http://38.147.170.48:3000/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
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
