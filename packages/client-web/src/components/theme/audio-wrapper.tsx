import { useChannelStore } from "@/stores";
import { Observer } from "mobx-react-lite";
import React, { PropsWithChildren } from "react";

export const AudioWrapper: React.FC<PropsWithChildren> = (props) => {
  const channelStore = useChannelStore();

  return (
    <>
      <Observer>
        {() => (
          <>
            {channelStore.mediaStreams.map((stream) => (
              <audio
                id={`stream-${stream.mediaStream.id}`}
                key={stream.mediaStream.id}
                autoPlay
                playsInline
                // 使用声音增益节点后，需要静音原轨道
                muted
                ref={(audio) => {
                  if (audio) {
                    console.log("au", audio);
                    audio.srcObject = stream.mediaStream;
                  }
                }}
              />
            ))}
          </>
        )}
      </Observer>
      {props.children}
    </>
  );
};
