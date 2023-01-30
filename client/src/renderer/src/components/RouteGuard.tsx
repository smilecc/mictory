import { useCommonStore } from "@renderer/stores";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RouteGuard: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const navigate = useNavigate();
  const commonStore = useCommonStore();

  useEffect(() => {
    if (commonStore.connectServers.length === 0) {
      navigate("/user/connect");
      return;
    }

    if (!commonStore.accessToken) {
      navigate("/user/login");
    }
  }, [commonStore.accessToken]);

  return <>{props.children}</>;
};
