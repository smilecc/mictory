import React from "react";
import ReactDOM from "react-dom/client";
import { BaseLayout } from "./Layout";
import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getStores, StoreContext } from "@renderer/stores";
import { HomePage } from "@renderer/pages";
import "./style.css";

const stores = getStores();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreContext.Provider value={stores}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <BaseLayout>
          <RouterProvider router={router} />
        </BaseLayout>
      </MantineProvider>
    </StoreContext.Provider>
  </React.StrictMode>
);
