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
                key={stream.id}
                autoPlay
                playsInline
                ref={(audio) => {
                  if (audio) {
                    console.log("au", audio);
                    audio.srcObject = stream;
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
