import { useReactive } from "ahooks";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
// import { useLoaderData } from "react-router-dom";
// import * as mediasoupClient from "mediasoup-client";
import { useParams } from "react-router-dom";
// import { NoiseSuppressionProcessor } from "@shiguredo/noise-suppression";
import { useQuery } from "@apollo/client";
import { gql } from "@/@generated";
import {
  ChannelBottomPannel,
  ChannelPanel,
  ChannelUsers,
  ChatPannel,
  CreateChannelCategoryModal,
  CreateRoomModal,
} from "@/components/business";
import { SocketClientContext } from "@/contexts";
import { first } from "lodash-es";
import { useChannelStore } from "@/stores";
import { IconPlaylistAdd, IconSettings, IconSquareRoundedPlus } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { sleep } from "@/utils";
import { ChatTarget } from "@/@generated/graphql";

const QUERY_CHANNEL_DETAIL = gql(`
query getChannelDetail($code: String!) {
  channels (where: { code: { equals: $code } } ) {
    id
    name
    code
    avatar
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

const ChannelMenuItem = React.memo<{ label: string; icon: React.FC; onClick?: () => void }>((props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent: any = props.icon;

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={props.onClick}>
      <IconComponent size={18} />
      <span className="ml-2">{props.label}</span>
    </DropdownMenuItem>
  );
});

export const ChannelPage: React.FC = () => {
  // const loaderData = useLoaderData();
  const channelStore = useChannelStore();
  const socketClient = useContext(SocketClientContext);
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
    selectChatRoomId: 0,
  });

  useEffect(() => {
    channelStore.loadMediaDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sleepFetchChannelDetail = useCallback(
    async (time: number) => {
      await sleep(time);
      await refetchChannelDetail({
        code: params.channelCode,
      });
    },
    [params.channelCode, refetchChannelDetail],
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

  return (
    <>
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
        </>
      )}

      <div className="flex flex-1 bg-surface2">
        {/* 频道 */}
        <div className="relative flex w-60 flex-col bg-surface1 pt-14">
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
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1 overflow-y-auto pt-2">
            {channel ? (
              <ChannelPanel
                channel={channel}
                onJoinRoom={(roomId) => {
                  state.selectChatRoomId = roomId;
                }}
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
          {state.selectChatRoomId ? (
            <ChatPannel
              type={ChatTarget.Room}
              roomId={state.selectChatRoomId}
              key={`ROOM_CHAT_${state.selectChatRoomId}`}
            />
          ) : null}
        </div>
      </div>
      <div className="w-72 break-words bg-surface1">
        <ChannelUsers users={channel?.users || []} />
      </div>
    </>
  );
};
