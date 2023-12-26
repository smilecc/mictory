import { JOIN_CHANNEL } from "@/queries";
import { RouteGuard } from "@/routes";
import { useCommonStore } from "@/stores";
import { NoticeErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const InviteLandPage: React.FC = () => {
  const params = useParams<{ code: string }>();
  const [join] = useMutation(JOIN_CHANNEL);
  const navigate = useNavigate();
  const commonStore = useCommonStore();

  useEffect(() => {
    if (commonStore.isLogin && params.code) {
      join({
        variables: {
          code: params.code,
        },
      })
        .then(({ data }) => {
          notifications.show({
            color: "green",
            message: "加入频道成功",
          });

          navigate(`/ch/${data?.channelJoin.code}`, { replace: true });
        })
        .catch((e) => {
          NoticeErrorHandler(e);
          navigate(`/ch`, { replace: true });
        });
    }
  }, [commonStore.isLogin, join, navigate, params.code]);

  return (
    <RouteGuard>
      <div className="fixed bottom-0 left-0 right-0 top-0">
        <LoadingOverlay visible />
      </div>
    </RouteGuard>
  );
};
