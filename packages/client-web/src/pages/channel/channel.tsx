import { useReactive } from "ahooks";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
// import { useLoaderData } from "react-router-dom";
// import * as mediasoupClient from "mediasoup-client";
import { useParams } from "react-router-dom";
// import { NoiseSuppressionProcessor } from "@shiguredo/noise-suppression";
import { useQuery } from "@apollo/client";
import { gql } from "@/@generated";
import { BaseLayout } from "@/components/layout/base-layout";
import { Card, Button, HoverCard, ActionIcon, Slider, Tooltip, Divider } from "@mantine/core";
import { ChannelPanel } from "@/components/business";
import { SocketClientContext } from "@/contexts";
import { Observer } from "mobx-react-lite";
import { first } from "lodash-es";
import { useChannelStore, useCommonStore } from "@/stores";
import {
  IconBroadcast,
  IconMicrophone,
  IconMicrophoneOff,
  IconPlugX,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";

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
    streams: [] as MediaStream[],
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
      <div className="flex flex-1 bg-surface2">
        {/* 频道 */}
        <div className="relative w-60 bg-surface1">
          <Card>{channel?.name}</Card>
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
          {/* 底部控制面板 */}
          <div className="absolute inset-x-0 bottom-0">
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
                            <ActionIcon>
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
                      {/* 麦克风音量 */}
                      <HoverCard width={200} withArrow openDelay={100}>
                        <HoverCard.Target>
                          <ActionIcon
                            onClick={() => {
                              // const current = commonStore.gainSetting.microphone;
                              // const history = commonStore.gainSetting.historyMicrophone || 100;
                              // commonStore.setGainItem("microphone", commonStore.gainSetting.microphone ? 0 : history);
                              // commonStore.setGainItem("historyMicrophone", current);
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
                            // onChange={(v) => commonStore.setGainItem("microphone", v)}
                          />
                        </HoverCard.Dropdown>
                      </HoverCard>
                      {/* 播放音量 */}
                      <HoverCard width={200} withArrow openDelay={100}>
                        <HoverCard.Target>
                          <ActionIcon
                            className="ml-1"
                            onClick={() => {
                              // const current = commonStore.gainSetting.volume;
                              // const history = commonStore.gainSetting.historyVolume || 100;
                              // commonStore.setGainItem("volume", commonStore.gainSetting.volume ? 0 : history);
                              // commonStore.setGainItem("historyVolume", current);
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
                            // onChange={(v) => commonStore.setGainItem("volume", v)}
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
          {state.streams.map((it) => (
            <audio
              key={it.id}
              controls
              autoPlay
              playsInline
              ref={(audio) => {
                if (audio) {
                  console.log("au", audio);
                  audio.srcObject = it;
                }
              }}
            />
          ))}
        </div>
      </div>
      <div>3</div>
    </BaseLayout>
  );
};
