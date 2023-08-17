import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { StoreContext, getStores } from "@/stores";
import { Routes } from "@/routes";
import { ThemeWrapper } from "@/components/theme/theme-wrapper";

const stores = getStores();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreContext.Provider value={stores}>
      <ThemeWrapper>
        <Routes />
      </ThemeWrapper>
    </StoreContext.Provider>
  </React.StrictMode>
);
