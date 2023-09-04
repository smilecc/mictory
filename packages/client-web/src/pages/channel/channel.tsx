import { Button } from "@/components/ui/button";
import { useReactive } from "ahooks";
import React, { useContext, useEffect, useMemo } from "react";
// import { useLoaderData } from "react-router-dom";
// import * as mediasoupClient from "mediasoup-client";
import { useParams } from "react-router-dom";
// import { NoiseSuppressionProcessor } from "@shiguredo/noise-suppression";
import { useQuery } from "@apollo/client";
import { gql } from "@/@generated";
import { BaseLayout } from "@/components/layout/base-layout";
import { Card } from "@mantine/core";
import { ChannelPanel } from "@/components/business";
import { SocketClientContext } from "@/contexts";
import _ from "lodash";

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
  // const commonStore = useCommonStore();
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
      socketClient.emit("activeChannel", { channelId: _.first(data.channels)?.id });
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
          <div className="absolute inset-x-0 bottom-0 bg-background/60 p-2">1</div>
        </div>
        <div className="flex-1">
          <Button
            variant="secondary"
            onClick={() => {
              // connect();
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
