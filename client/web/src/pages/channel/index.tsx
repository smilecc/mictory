import { SideAvatar } from "@/components/business";
import { Button } from "@/components/ui/button";
import { useCommonStore } from "@/stores";
import { useMount } from "ahooks";
import React, { useCallback } from "react";
// import { useLoaderData } from "react-router-dom";
import { io } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

const socket = io("http://localhost:3000");

export const ChannelPage: React.FC = () => {
  // const loaderData = useLoaderData();
  // const commonStore = useCommonStore();
  useMount(() => {
    console.log("mount");
  });

  const connect = useCallback(async () => {
    const rtpCapabilities = await socket.emitWithAck(
      "getRouterRtpCapabilities",
    );
    console.log(rtpCapabilities);

    const device = new mediasoupClient.Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });

    // device.create
    console.log("device", device);

    // 创建连接
    const sendTransport = await socket.emitWithAck("createWebRtcTransport");
    const transport = device.createSendTransport(sendTransport);

    transport.on("connect", async (data, callback, errback) => {
      socket
        .emitWithAck("connectTransport", data)
        .then(callback)
        .catch(errback);
    });
  }, []);

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
            <div className="absolute inset-x-0 bottom-0 bg-background/60 p-2">
              1
            </div>
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
