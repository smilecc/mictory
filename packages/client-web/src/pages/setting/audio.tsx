import { IconSwtich } from "@/components/ui/icon-switch";
import { useChannelStore } from "@/stores";
import { Divider, Input, Select, Slider, Title } from "@mantine/core";
import { Observer } from "mobx-react-lite";
import React, { useEffect } from "react";

const SettingAudio: React.FC = () => {
  const channelStore = useChannelStore();

  useEffect(() => {
    channelStore.loadMediaDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Title order={2}>语音设置</Title>
      <div>
        <Title order={6} className="my-4">
          设备与音量
        </Title>

        <Observer>
          {() => (
            <div className="flex">
              <div className="flex-1">
                <Select
                  label="输入设备"
                  value={channelStore.audioDevice.inputDeviceId}
                  onChange={(v) => {
                    channelStore.setInputMediaDevice(v!);
                  }}
                  data={channelStore.mediaDeviceInfos
                    .filter((it) => it.kind === "audioinput")
                    .map((it) => ({
                      label: it.label,
                      value: it.deviceId,
                    }))}
                />

                <Input.Wrapper label="输入音量" mt="md">
                  <Slider
                    max={300}
                    value={channelStore.audioGain.microphone}
                    onChange={(v) => channelStore.setAudioGainItem("microphone", v)}
                  />
                </Input.Wrapper>
              </div>

              <div className="w-6" />

              <div className="flex-1">
                <Select
                  label="输出设备"
                  value={channelStore.audioDevice.outputDeviceId}
                  onChange={(v) => {
                    channelStore.setAudioDevice("outputDeviceId", v!);
                  }}
                  data={channelStore.mediaDeviceInfos
                    .filter((it) => it.kind === "audiooutput")
                    .map((it) => ({
                      label: it.label,
                      value: it.deviceId,
                    }))}
                />

                <Input.Wrapper label="输出音量" mt="md">
                  <Slider
                    max={300}
                    value={channelStore.audioGain.volume}
                    onChange={(v) => channelStore.setAudioGainItem("volume", v)}
                  />
                </Input.Wrapper>
              </div>
            </div>
          )}
        </Observer>

        <Divider my="lg" />

        <Title order={6} className="mb-4">
          其他设置
        </Title>

        <Observer>
          {() => (
            <>
              <Input.Wrapper label="AI降噪" mt="md">
                <IconSwtich
                  className="mt-2"
                  checked={channelStore.audioNoiseSuppression}
                  onChange={() => channelStore.toggleNoiseSuppression()}
                />
              </Input.Wrapper>

              <Input.Wrapper label="回音抵消" mt="md">
                <IconSwtich
                  className="mt-2"
                  checked={channelStore.audioDevice.echoCancellation}
                  onChange={(e) => channelStore.setAudioDevice("echoCancellation", e.currentTarget.checked)}
                />
              </Input.Wrapper>

              <Input.Wrapper label="自动声音增益" mt="md">
                <IconSwtich
                  className="mt-2"
                  checked={channelStore.audioDevice.autoGainControl}
                  onChange={(e) => channelStore.setAudioDevice("autoGainControl", e.currentTarget.checked)}
                />
              </Input.Wrapper>
            </>
          )}
        </Observer>
      </div>
    </div>
  );
};

export default SettingAudio;
