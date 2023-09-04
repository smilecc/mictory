import React, { useEffect } from "react";
import { autorun } from "mobx";
import { createHashRouter, RouterProvider, Navigate, useNavigate } from "react-router-dom";
import { HomePage } from "@/pages/Home";
import { ChannelPage } from "@/pages/channel/channel";
import { LoginPage } from "@/pages/user/login";
import { UserCreatePage } from "@/pages/user/create";
import { MessagePage } from "./pages/channel/message";
import { useCommonStore } from "@/stores";

export const RouteGuard: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const navigate = useNavigate();
  const commonStore = useCommonStore();

  useEffect(
    () =>
      autorun(() => {
        console.log("autorun");
        if (commonStore.isNotLogin) {
          navigate("/user/login");
        }
      }),
    [],
  );

  return <>{props.children}</>;
};

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
    element: <LoginPage />,
  },
  {
    path: "/user/create",
    element: <UserCreatePage />,
  },
  {
    path: "/channel",
    children: [
      {
        path: "",
        element: (
          <RouteGuard>
            <Navigate to="/channel/@msg" replace />
          </RouteGuard>
        ),
      },
      {
        path: "@msg",
        element: (
          <RouteGuard>
            <MessagePage />
          </RouteGuard>
        ),
      },
      {
        path: ":channelCode",
        element: (
          <RouteGuard>
            <ChannelPage />
          </RouteGuard>
        ),
        loader: async (args) => {
          console.log(args);

          return null;
        },
      },
    ],
  },
]);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
