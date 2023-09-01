import { SideAvatar } from "@/components/business";
import { Button } from "@/components/ui/button";
import { useCommonStore } from "@/stores";
import { useMount, useReactive } from "ahooks";
import React, { useCallback, useContext, useEffect, useState } from "react";
// import { useLoaderData } from "react-router-dom";
import * as mediasoupClient from "mediasoup-client";
import { useSearchParams } from "react-router-dom";
import { NoiseSuppressionProcessor } from "@shiguredo/noise-suppression";
import { useQuery } from "@apollo/client";
import { gql } from "@/@generated";
import { SocketClientContext } from "@/contexts";
import { Loader, Transition } from "@mantine/core";

const QUERY_USER_CHANNELS = gql(`
query listUserChannel {
  user(where: { nicknameNo: { equals: -1 } }) {
    id
    channels {
      channel {
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
        rooms {
          id
          name
          maxMember
          sort
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
  const { data, loading: userChannelLoading } = useQuery(QUERY_USER_CHANNELS);

  const state = useReactive({
    firstLoading: true,
    streams: [] as MediaStream[],
  });

  useEffect(() => {
    if (!userChannelLoading && state.firstLoading) {
      state.firstLoading = false;
    }
  }, [state, userChannelLoading]);

  useEffect(() => {
    socketClient.connect();
    console.log("socketClient.connect()");

    return () => {
      socketClient.close();
      console.log("socketClient.close()");
    };
  }, [socketClient]);

  // const connect = useCallback(async () => {
  //   const roomId = 1;
  //   const rtpCapabilities = await socket.emitWithAck("getRouterRtpCapabilities", {
  //     roomId,
  //   });
  //   console.log(rtpCapabilities);

  //   const device = new mediasoupClient.Device();
  //   await device.load({ routerRtpCapabilities: rtpCapabilities });

  //   // device.create
  //   console.log("device", device, searchParams);
  //   const userId = searchParams.get("userId");

  //   // 创建连接
  //   const roomSession = await socket.emitWithAck("joinRoom", { roomId });
  //   console.log("roomSession", roomSession);

  //   const producers = (await socket.emitWithAck("getRoomProducers")) as string[];
  //   console.log("producers", producers);

  //   const produceTransport = await socket.emitWithAck("createTransport", {
  //     direction: "Producer",
  //   });

  //   const sendTransport = device.createSendTransport(produceTransport);

  //   sendTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
  //     socket
  //       .emitWithAck("connectTransport", {
  //         transportId: sendTransport.id,
  //         dtlsParameters,
  //       })
  //       .then(callback)
  //       .catch(errback);
  //   });

  //   sendTransport.on("produce", async ({ kind, rtpParameters }, callback) => {
  //     const produceResp = await socket.emitWithAck("produceTransport", {
  //       transportId: sendTransport.id,
  //       kind,
  //       rtpParameters,
  //     });

  //     callback({ id: produceResp.id });
  //   });

  //   sendTransport.on("connectionstatechange", (state) => console.log("send:connectionstatechange", state));
  //   const processor = new NoiseSuppressionProcessor("/noise-suppression/");

  //   const stream = await navigator.mediaDevices
  //     .getUserMedia({
  //       audio: true,
  //       video: false,
  //     })
  //     .then(async (stream) => {
  //       return stream;
  //       // const track = stream.getAudioTracks()[0];

  //       // const processed_track = await processor.startProcessing(track);
  //       // return new MediaStream([processed_track]);
  //     });

  //   const producer = await sendTransport.produce({
  //     track: stream.getAudioTracks()[0],
  //   });

  //   // 消费
  //   const consumeTransport = await socket.emitWithAck("createTransport", {
  //     direction: "Consumer",
  //   });

  //   const recvTransport = device.createRecvTransport(consumeTransport);

  //   recvTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
  //     console.log("recvTransport:connect");
  //     socket
  //       .emitWithAck("connectTransport", {
  //         transportId: recvTransport.id,
  //         dtlsParameters,
  //       })
  //       .then(callback)
  //       .catch(errback);
  //   });

  //   recvTransport.on("connectionstatechange", (state) => console.log("recv:connectionstatechange", state));

  //   const consume = async (producerId: string) => {
  //     const consumerData = await socket.emitWithAck("consumeTransport", {
  //       producerId: producerId,
  //       transportId: recvTransport.id,
  //       rtpCapabilities: device.rtpCapabilities,
  //     });

  //     const consumer = await recvTransport.consume({
  //       ...consumerData,
  //     });

  //     consumer.on("@close", () => {
  //       state.streams = state.streams.filter((it) => it.id === consumer.id);
  //     });

  //     const ms = new MediaStream();
  //     ms.addTrack(consumer.track);
  //     state.streams.push(ms);
  //   };

  //   producers.forEach(consume);
  // }, [searchParams, state]);

  return (
    <div className="relative h-screen w-screen">
      {/* 加载覆盖层 */}
      <Transition mounted={state.firstLoading} transition="fade" duration={200} timingFunction="ease">
        {(styles) => (
          <div
            style={styles}
            className="absolute inset-x-0 inset-y-0 z-50 flex items-center justify-center bg-surface1"
          >
            <Loader variant="dots" size="xl" />
          </div>
        )}
      </Transition>

      <main className="h-screen">
        {/* <div>
        <div>Mictory</div>
      </div> */}
        <div className="flex h-full">
          {/* 侧边栏 */}
          <div className="bg-background pr-2 pt-2">
            {data?.user?.channels?.map((it) => (
              <div>
                <SideAvatar name={it.channel.name} key={it.channel.id} />
              </div>
            ))}
          </div>
          <div className="flex flex-1 bg-surface2">
            {/* 频道 */}
            <div className="relative w-60 bg-surface1">
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
        </div>
      </main>
    </div>
  );
};
