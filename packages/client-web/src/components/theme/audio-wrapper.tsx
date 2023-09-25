import { useChannelStore } from "@/stores";
import { reaction } from "mobx";
import { Observer } from "mobx-react-lite";
import React, { Fragment, PropsWithChildren, useEffect, useRef } from "react";

const AudioElement: React.FC<{ stream: MediaStream; muted?: boolean }> = (props) => {
  const audioRef = useRef<HTMLAudioElement & { setSinkId: (deviceId: string) => void }>();
  const channelStore = useChannelStore();
  const { stream, muted } = props;

  useEffect(
    () =>
      reaction(
        () => channelStore.audioDevice.outputDeviceId,
        (newDeviceId) => {
          audioRef.current?.setSinkId(newDeviceId);
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <audio
      id={`stream-${stream.id}`}
      key={stream.id}
      autoPlay
      playsInline
      muted={muted}
      ref={(audio) => {
        if (audio) {
          console.log("au", audio);
          audio.srcObject = stream;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          audioRef.current = audio as any;
          audioRef.current!.setSinkId(channelStore.audioDevice.outputDeviceId);
        }
      }}
    />
  );
};

export const AudioWrapper: React.FC<PropsWithChildren> = (props) => {
  const channelStore = useChannelStore();

  return (
    <>
      <Observer>
        {() => (
          <>
            {channelStore.mediaStreams
              .filter((it) => it.ready)
              .map((stream) => (
                <Fragment key={stream.mediaStream.id}>
                  <AudioElement stream={stream.mediaStream} muted={!!stream.actualStream} />
                  {stream.actualStream && <AudioElement stream={stream.actualStream} muted={false} />}
                </Fragment>
              ))}
          </>
        )}
      </Observer>
      {props.children}
    </>
  );
};
