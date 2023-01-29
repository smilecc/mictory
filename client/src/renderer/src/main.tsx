import React from "react";
import ReactDOM from "react-dom/client";
import { BaseLayout } from "./Layout";
import { MantineProvider } from "@mantine/core";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { getStores, StoreContext } from "@renderer/stores";
import { HomePage, SettingPage, UserLoginPage } from "@renderer/pages";
import { RouteGuard } from "./components";
import "./style.css";
import { NotificationsProvider } from "@mantine/notifications";

// 禁止鼠标的前进返回按钮
window.addEventListener("mouseup", (e) => {
  if (import.meta.env.PROD && (e.button === 3 || e.button === 4)) e.preventDefault();
});

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
    path: "/setting",
    element: (
      <RouteGuard>
        <SettingPage />
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
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark" }}>
        <NotificationsProvider>
          <BaseLayout>
            <RouterProvider router={router} />
          </BaseLayout>
        </NotificationsProvider>
      </MantineProvider>
    </StoreContext.Provider>
  </React.StrictMode>
);
