import React, { useEffect } from "react";
import { autorun } from "mobx";
import { createBrowserRouter, RouterProvider, Navigate, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(
    () =>
      autorun(() => {
        console.log("autorun");
        if (commonStore.isNotLogin) {
          commonStore.loginRedirect = `${location.pathname}${location.search}`;
          navigate("/user/login");
        } else {
          commonStore.loginRedirect = undefined;
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
    Component: () => <Navigate to="/ch" replace />,
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
    path: "/i/:code",
    lazy: async () => {
      const { InviteLandPage } = await import("@/pages/channel/invite-land");
      return {
        Component: InviteLandPage,
      };
    },
  },
  {
    path: "/ch",
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
            <Navigate to="/ch/@msg" replace />
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
