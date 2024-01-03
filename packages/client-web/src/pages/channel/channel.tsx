import { useReactive } from "ahooks";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
// import { useLoaderData } from "react-router-dom";
// import * as mediasoupClient from "mediasoup-client";
import { useNavigate, useParams } from "react-router-dom";
// import { NoiseSuppressionProcessor } from "@shiguredo/noise-suppression";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@/@generated";
import {
  ChannelBottomPannel,
  ChannelPanel,
  ChannelPermissionWrapper,
  ChannelUsers,
  ChatPannel,
  CreateChannelCategoryModal,
  CreateChannelInviteModal,
  CreateRoomModal,
} from "@/components/business";
import { SocketClientContext } from "@/contexts";
import { first } from "lodash-es";
import { useChannelStore } from "@/stores";
import { IconDoorExit, IconPlaylistAdd, IconSettings, IconSquareRoundedPlus, IconUserPlus } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChannelContext, NoticeErrorHandler, sleep } from "@/utils";
import { ChannelRolePermissionCode, ChatTarget } from "@/@generated/graphql";
import { EXIT_CHANNEL } from "@/queries";
import { cn } from "@/lib/utils";
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const QUERY_CHANNEL_DETAIL = gql(`
query getChannelDetail($code: String!) {
  channels (where: { code: { equals: $code } } ) {
    id
    name
    code
    avatar
    currentUser {
      userId
      channelRole {
        id
        name
        permissions {
          id
          code
        }
      }
    }
    ownerUser {
      id
      nickname
      nicknameNo
      sessionState
      avatar
    }
    users {
      role: channelRole {
        name
        color
      }
      user {
        id
        nickname
        nicknameNo
        sessionState
        avatar
      }
    }
    categories {
      id
      name
      rooms {
        id
        name
        maxMember
        sort
        channelId
        users {
          id
          nickname
          nicknameNo
          avatar
        }
      }
    }
  }
}
`);

const ChannelMenuItem = React.memo<{ className?: string; label: string; icon: React.FC; onClick?: () => void }>(
  (props) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent: any = props.icon;

    return (
      <DropdownMenuItem className={cn("cursor-pointer", props.className)} onClick={props.onClick}>
        <IconComponent size={18} />
        <span className="ml-2">{props.label}</span>
      </DropdownMenuItem>
    );
  },
);

export const ChannelPage: React.FC = () => {
  // const loaderData = useLoaderData();
  const channelStore = useChannelStore();
  const socketClient = useContext(SocketClientContext);
  const [exitChannel] = useMutation(EXIT_CHANNEL);
  const navigate = useNavigate();
  const params = useParams<{ channelCode: string }>();
  const {
    data,
    refetch: refetchChannelDetail,
    loading,
  } = useQuery(QUERY_CHANNEL_DETAIL, {
    pollInterval: 60 * 1000,
    variables: {
      code: params.channelCode || "",
    },
    onCompleted(data) {
      channelStore.activeChannelId = first(data.channels)?.id;
      socketClient.emit("activeChannel", { channelId: channelStore.activeChannelId });
      console.log("activeChannel", channelStore.activeChannelId);
    },
  });

  const channel = useMemo(() => data?.channels?.at(0), [data]);

  const state = useReactive({
    createRoomModalOpen: false,
    createCategoryModalOpen: false,
    createChannelInviteModalOpen: false,
  });

  useEffect(() => {
    channelStore.loadMediaDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sleepFetchChannelDetail = useCallback(
    async (time: number) => {
      await sleep(time);
      await refetchChannelDetail();
    },
    [refetchChannelDetail],
  );

  useEffect(() => {
    socketClient.on("channelNeedReload", async () => {
      console.log("channelNeedReload -> onShouldRefetch");
      // 积极加载2次
      await sleepFetchChannelDetail(100);
      await sleepFetchChannelDetail(1000);
    });

    return () => {
      console.log('socketClient.off("channelNeedReload")');
      socketClient.off("channelNeedReload");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.id, loading]);

  useEffect(() => {
    if (params.channelCode) {
      console.log(params.channelCode);
      refetchChannelDetail({
        code: params.channelCode,
      });
    }
  }, [refetchChannelDetail, params.channelCode]);

  const onExitChannel = useCallback(() => {
    modals.openConfirmModal({
      title: "确认",
      centered: true,
      children: <Text size="sm">是否确认要退出频道？</Text>,
      labels: { confirm: "确认退出", cancel: "取消" },
      confirmProps: { color: "red" },
      async onConfirm() {
        if (channel?.id === channelStore.joinedChannelId) {
          await channelStore.exitRoom();
        }

        exitChannel({
          variables: {
            id: channel?.id,
          },
        })
          .then(() => {
            channelStore.firstLoading = true;
            navigate("/ch/");
            notifications.show({
              color: "green",
              message: "退出频道成功",
            });
          })
          .catch(NoticeErrorHandler);
      },
    });
  }, [channel?.id, channelStore, exitChannel, navigate]);

  return (
    <ChannelContext.Provider value={channel || null}>
      {channel && (
        <>
          {/* 创建房间 */}
          <CreateRoomModal
            channelId={channel.id}
            categories={channel?.categories || []}
            opened={state.createRoomModalOpen}
            onClose={() => (state.createRoomModalOpen = false)}
            onOk={() => {
              state.createRoomModalOpen = false;
              refetchChannelDetail({
                code: params.channelCode,
              });
            }}
          />

          {/* 创建类目 */}
          <CreateChannelCategoryModal
            channelId={channel.id}
            opened={state.createCategoryModalOpen}
            onClose={() => (state.createCategoryModalOpen = false)}
            onOk={() => {
              state.createCategoryModalOpen = false;
              refetchChannelDetail({
                code: params.channelCode,
              });
            }}
          />

          <CreateChannelInviteModal
            channelId={channel.id}
            opened={state.createChannelInviteModalOpen}
            onClose={() => (state.createChannelInviteModalOpen = false)}
          />
        </>
      )}

      <div className="flex flex-1 bg-surface2">
        {/* 频道 */}
        <div className="relative flex w-72 flex-col bg-surface1 pt-14">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="absolute left-0 right-0 top-0 cursor-pointer bg-surface1"
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="bg-background/20 p-4">{channel?.name}</div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <ChannelPermissionWrapper permission={ChannelRolePermissionCode.Admin}>
                <ChannelMenuItem label="频道设置" icon={IconSettings} />
                <ChannelMenuItem
                  label="创建分组"
                  icon={IconPlaylistAdd}
                  onClick={() => (state.createCategoryModalOpen = true)}
                />
                <ChannelMenuItem
                  label="创建房间"
                  icon={IconSquareRoundedPlus}
                  onClick={() => (state.createRoomModalOpen = true)}
                />
              </ChannelPermissionWrapper>
              <ChannelPermissionWrapper permission={ChannelRolePermissionCode.Invite}>
                <ChannelMenuItem
                  label="邀请好友"
                  icon={IconUserPlus}
                  onClick={() => (state.createChannelInviteModalOpen = true)}
                />
              </ChannelPermissionWrapper>
              <ChannelMenuItem label="退出频道" icon={IconDoorExit} className="text-red-500" onClick={onExitChannel} />
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1 overflow-y-auto pt-2">
            {channel ? (
              <ChannelPanel
                channel={channel}
                onOpenInvite={() => (state.createChannelInviteModalOpen = true)}
                onJoinRoom={(roomId) => (channelStore.chatRoomId = roomId)}
                onShouldRefetch={() => {
                  refetchChannelDetail({
                    code: params.channelCode,
                  });
                }}
              />
            ) : null}
          </div>
          {/* 底部控制面板 */}
          <ChannelBottomPannel />
        </div>
        <div className="flex-1">
          {channelStore.chatRoomId ? (
            <ChatPannel
              type={ChatTarget.Room}
              roomId={channelStore.chatRoomId}
              key={`ROOM_CHAT_${channelStore.chatRoomId}`}
            />
          ) : null}
        </div>
      </div>
      <div className="w-72 break-words bg-surface1">
        <ChannelUsers users={channel?.users || []} />
      </div>
    </ChannelContext.Provider>
  );
};
