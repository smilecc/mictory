import React, { useEffect } from "react";
import { autorun } from "mobx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "@/pages/Home";

export const RouteGuard: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  // const navigate = useNavigate();
  // const commonStore = useCommonStore();

  useEffect(
    () =>
      autorun(() => {
        console.log("autorun");
        // if (commonStore.connectServers.length === 0) {
        //   navigate("/user/connect");
        //   return;
        // }

        // if (!commonStore.accessToken) {
        //   navigate("/user/login");
        // }
      }),
    []
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
]);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
