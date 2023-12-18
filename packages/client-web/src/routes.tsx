import React, { useEffect } from "react";
import { autorun } from "mobx";
import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from "react-router-dom";
import { useCommonStore } from "@/stores";
import { gql } from "./@generated";
import { useLazyQuery } from "@apollo/client";

const FETCH_CURRENT_USER = gql(`query fetchCurrentUser {
  user (where: { nicknameNo: { equals: -1 } }) {
    id
    nickname
    nicknameNo
  }
}`);

export const RouteGuard: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [loadUser] = useLazyQuery(FETCH_CURRENT_USER);
  const navigate = useNavigate();
  const commonStore = useCommonStore();

  useEffect(
    () =>
      autorun(() => {
        console.log("autorun");
        if (commonStore.isNotLogin) {
          navigate("/user/login");
        } else {
          loadUser().then(({ data }) => {
            commonStore.user = data?.user;
          });
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <>{props.children}</>;
};

const router = createBrowserRouter([
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
    lazy: async () => {
      const { ChannelLayoutPage } = await import("@/pages/channel/layout");
      return {
        Component: ChannelLayoutPage,
      };
    },
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
