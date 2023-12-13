import React, { useEffect } from "react";
import { autorun } from "mobx";
import { createHashRouter, RouterProvider, Navigate, useNavigate, RouteObject } from "react-router-dom";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <>{props.children}</>;
};

const settingRoutes: RouteObject[] = [
  {
    path: "setting/audio",
    lazy: async () => ({
      Component: (await import("@/pages/setting/audio")).default,
    }),
  },
];

const router = createHashRouter([
  {
    path: "/",
    Component: () => <Navigate to="/channel" replace />,
    // lazy: async () => {
    //   const { HomePage } = await import("@/pages/Home");
    //   return {
    //     Component: HomePage,
    //   };
    // },
  },
  {
    path: "/user/login",
    lazy: async () => {
      const { LoginPage } = await import("@/pages/user/login");
      return {
        Component: LoginPage,
      };
    },
  },
  {
    path: "/user/create",
    lazy: async () => {
      const { UserCreatePage } = await import("@/pages/user/create");
      return {
        Component: UserCreatePage,
      };
    },
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
        lazy: async () => {
          const { MessagePage } = await import("@/pages/channel/message");
          return {
            Component: MessagePage,
          };
        },
        children: [...settingRoutes],
      },
      {
        path: ":channelCode",
        lazy: async () => {
          const { ChannelPage } = await import("@/pages/channel/channel");
          return {
            Component: ChannelPage,
          };
        },
        children: [
          ...settingRoutes,
          {
            path: ":roomId",
            lazy: async () => {
              const { RoomPage } = await import("@/pages/channel/room");
              return {
                Component: RoomPage,
              };
            },
          },
        ],
      },
    ],
  },
]);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
