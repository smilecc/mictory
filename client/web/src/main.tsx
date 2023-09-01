import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { StoreContext, getStores } from "@/stores";
import { Routes } from "@/routes";
import { ThemeWrapper } from "@/components/theme/theme-wrapper";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { io } from "socket.io-client";

const stores = getStores();

export const client = new ApolloClient({
  uri: "http://38.147.170.48:3000/graphql",
  cache: new InMemoryCache(),
});

const socket = io("http://38.147.170.48:3000", {
  autoConnect: false,
  auth(cb) {
    const token = localStorage.getItem("_TOKEN");
    console.log("auth cb", token);
    cb({
      token,
    });
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <StoreContext.Provider value={stores}>
        <ThemeWrapper>
          <Routes />
        </ThemeWrapper>
      </StoreContext.Provider>
    </ApolloProvider>
  </React.StrictMode>,
);
