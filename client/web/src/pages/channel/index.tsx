import { SideAvatar } from "@/components/business";
import { Button } from "@/components/ui/button";
import { useCommonStore } from "@/stores";
import { useMount } from "ahooks";
import React, { useCallback } from "react";
// import { useLoaderData } from "react-router-dom";
import { io } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import { useSearchParams } from "react-router-dom";

const socket = io("http://localhost:3000");

export const ChannelPage: React.FC = () => {
  // const loaderData = useLoaderData();
  // const commonStore = useCommonStore();
  useMount(() => {
    console.log("mount");
  });

  const [searchParams] = useSearchParams();

  const connect = useCallback(async () => {
    const rtpCapabilities = await socket.emitWithAck("getRouterRtpCapabilities");
    console.log(rtpCapabilities);

    const device = new mediasoupClient.Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });

    // device.create
    console.log("device", device, searchParams);
    const userId = searchParams.get("userId");

    // 创建连接
    const roomSession = await socket.emitWithAck("joinRoom", { userId });
    console.log("roomSession", roomSession);

    const sendTransport = device.createSendTransport(roomSession.sendTransport);
    const recvTransport = device.createRecvTransport(roomSession.recvTransport);

    sendTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      socket
        .emitWithAck("connectTransport", {
          send: true,
          userId,
          dtlsParameters,
          id: sendTransport.id,
        })
        .then(callback)
        .catch(errback);
    });

    sendTransport.on("produce", async ({ kind, rtpParameters }, callback) => {
      const produceResp = await socket.emitWithAck("produceTransport", {
        userId,
        id: sendTransport.id,
        kind,
        rtpParameters,
      });

      callback({ id: produceResp.id });
    });

    sendTransport.on("connectionstatechange", (state) => console.log("send:connectionstatechange", state));

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    await sendTransport.produce({
      track: stream.getAudioTracks()[0],
    });

    recvTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      console.log("recvTransport:connect");
      socket
        .emitWithAck("connectTransport", {
          userId,
          dtlsParameters,
          id: recvTransport.id,
        })
        .then(callback)
        .catch(errback);
    });

    recvTransport.on("connectionstatechange", (state) => console.log("recv:connectionstatechange", state));
    // recvTransport.
  }, [searchParams]);

  return (
    <main className="h-screen">
      {/* <div>
        <div>Mictory</div>
      </div> */}
      <div className="flex h-full">
        {/* 侧边栏 */}
        <div className="bg-background pr-2 pt-2">
          <SideAvatar />
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
                connect();
              }}
            >
              切换主题
            </Button>
          </div>
        </div>
        <div>3</div>
      </div>
    </main>
  );
};
