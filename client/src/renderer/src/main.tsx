import React from "react";
import ReactDOM from "react-dom/client";
import { BaseLayout } from "./Layout";
import { MantineProvider } from "@mantine/core";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { getStores, StoreContext } from "@renderer/stores";
import { HomePage, UserLoginPage } from "@renderer/pages";
import { RouteGuard } from "./components";
import "./style.css";

const stores = getStores();

const router = createHashRouter([
  {
    path: "/",
    element: (
      <RouteGuard>
        <HomePage />
      </RouteGuard>
    ),
  },
  {
    path: "/user/login",
    element: <UserLoginPage />,
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
