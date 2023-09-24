import { useReactive } from "ahooks";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
// import { useLoaderData } from "react-router-dom";
// import * as mediasoupClient from "mediasoup-client";
import { useParams } from "react-router-dom";
// import { NoiseSuppressionProcessor } from "@shiguredo/noise-suppression";
import { useQuery } from "@apollo/client";
import { gql } from "@/@generated";
import { BaseLayout } from "@/components/layout/base-layout";
import { Button, HoverCard, ActionIcon, Slider, Tooltip, Divider } from "@mantine/core";
import { ChannelPanel, CreateChannelCategoryModal, CreateRoomModal } from "@/components/business";
import { SocketClientContext } from "@/contexts";
import { Observer } from "mobx-react-lite";
import { first } from "lodash-es";
import { useChannelStore, useCommonStore } from "@/stores";
import {
  IconAccessPoint,
  IconAccessPointOff,
  IconBroadcast,
  IconMicrophone,
  IconMicrophoneOff,
  IconPlaylistAdd,
  IconPlugX,
  IconSettings,
  IconSquareRoundedPlus,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const QUERY_CHANNEL_DETAIL = gql(`
query getChannelDetail($code: String!) {
  channels (where: { code: { equals: $code } } ) {
    id
    name
    code
    avatar
    ownerUser {
      ...UserFrag
    }
    users {
      role: channelRole {
        name
        color
      }
      user {
        ...UserFrag
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

fragment UserFrag on User {
  id
  nickname
  nicknameNo
  sessionState
  avatar
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
  const commonStore = useCommonStore();
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
      socketClient.emit("activeChannel", { channelId: first(data.channels)?.id });
    },
  });

  const channel = useMemo(() => data?.channels?.at(0), [data]);

  const state = useReactive({
    createRoomModalOpen: false,
    createCategoryModalOpen: false,
  });

  useEffect(() => {
    socketClient.on("channelNeedReload", () => {
      console.log("channelNeedReload -> onShouldRefetch");
      refetchChannelDetail({
        code: params.channelCode,
      });
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

  const handleAudioControlPanel = useCallback(() => {
    switch (channelStore.connectionState) {
      case "new":
        return <span className="">语音未连接</span>;
      case "connecting":
        return <span className="">语音连接中</span>;
      case "connected":
        return (
          <>
            <IconBroadcast size="18px" />
            <span className="ml-1.5">语音已连接</span>
          </>
        );

      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseLayout>
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
                onShouldRefetch={() => {
                  refetchChannelDetail({
                    code: params.channelCode,
                  });
                }}
              />
            ) : null}
          </div>
          {/* 底部控制面板 */}
          <div className="">
            {/* 用户信息 */}
            <Observer>
              {() => (
                <div className="select-none bg-background/30 p-3">
                  {channelStore.joinedChannel ? (
                    <>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <div className="flex items-end text-sm font-bold">
                            <Observer>{() => handleAudioControlPanel()}</Observer>
                          </div>
                          <div className="mt-0.5 text-xs text-foreground/40">{channelStore.joinedChannel.name}</div>
                        </div>
                        <div>
                          <Tooltip label="退出语音" position="right" color="dark">
                            <ActionIcon
                              onClick={async () => {
                                await channelStore.exitRoom();
                                refetchChannelDetail();
                              }}
                            >
                              <IconPlugX size="26px" color="red" />
                            </ActionIcon>
                          </Tooltip>
                        </div>
                      </div>
                      <Divider className="my-3" />
                    </>
                  ) : null}

                  <div className="flex items-center justify-between">
                    <div className="w-36 cursor-pointer">
                      <div className="overflow-hidden text-ellipsis text-sm text-foreground/80">
                        {channelStore.userWithChannels?.nickname}
                      </div>
                      <div className="overflow-hidden text-ellipsis text-xs text-foreground/40">
                        #{channelStore.userWithChannels?.nicknameNo}
                      </div>
                    </div>
                    <div className="flex">
                      {/* 降噪 */}
                      <Tooltip
                        label={`AI降噪 - ${channelStore.audioNoiseSuppression ? "已开启" : "已关闭"}`}
                        color="dark"
                      >
                        <ActionIcon
                          onClick={() => {
                            channelStore.toggleNoiseSuppression();
                          }}
                        >
                          {channelStore.audioNoiseSuppression ? (
                            <IconAccessPoint size={18} />
                          ) : (
                            <IconAccessPointOff size={18} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                      {/* 麦克风音量 */}
                      <HoverCard width={200} withArrow openDelay={100}>
                        <HoverCard.Target>
                          <ActionIcon
                            className="ml-1"
                            onClick={() => {
                              const current = channelStore.audioGain.microphone;
                              const history = channelStore.audioGain.historyMicrophone || 100;
                              channelStore.setAudioGainItem("microphone", current ? 0 : history);
                              channelStore.setAudioGainItem("historyMicrophone", current);
                            }}
                          >
                            {channelStore.audioGain.microphone ? (
                              <IconMicrophone size={18} />
                            ) : (
                              <IconMicrophoneOff size={18} />
                            )}
                          </ActionIcon>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Slider
                            max={300}
                            labelAlwaysOn
                            value={channelStore.audioGain.microphone}
                            onChange={(v) => channelStore.setAudioGainItem("microphone", v)}
                          />
                        </HoverCard.Dropdown>
                      </HoverCard>
                      {/* 播放音量 */}
                      <HoverCard width={200} withArrow openDelay={100}>
                        <HoverCard.Target>
                          <ActionIcon
                            className="ml-1"
                            onClick={() => {
                              const current = channelStore.audioGain.volume;
                              const history = channelStore.audioGain.historyVolume || 100;
                              channelStore.setAudioGainItem("volume", current ? 0 : history);
                              channelStore.setAudioGainItem("historyVolume", current);
                            }}
                          >
                            {channelStore.audioGain.volume ? <IconVolume size={18} /> : <IconVolumeOff size={18} />}
                          </ActionIcon>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Slider
                            max={300}
                            labelAlwaysOn
                            value={channelStore.audioGain.volume}
                            onChange={(v) => channelStore.setAudioGainItem("volume", v)}
                          />
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </div>
                  </div>
                </div>
              )}
            </Observer>
          </div>
        </div>
        <div className="flex-1">
          <Button
            variant="secondary"
            onClick={() => {
              commonStore.setThemeDarkMode(commonStore.themeDarkMode === "dark" ? "light" : "dark");
            }}
          >
            切换主题
          </Button>
        </div>
      </div>
      <div>3</div>
    </BaseLayout>
  );
};
