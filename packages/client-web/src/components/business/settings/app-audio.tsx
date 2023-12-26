import { IconSwtich } from "@/components/ui/icon-switch";
import { useChannelStore } from "@/stores";
import { Card, Input, Select, Slider, Title } from "@mantine/core";
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
      <Title order={2} className="text-white">
        语音设置
      </Title>
      <div>
        <Title order={5} className="my-4 text-white">
          设备与音量
        </Title>

        <Card className="overflow-visible">
          <Observer>
            {() => (
              <div className="flex">
                <div className="flex-1">
                  <Select
                    label="输入设备"
                    value={channelStore.audioDevice.inputDeviceId}
                    placeholder="请选择设备"
                    onChange={(v) => {
                      channelStore.setInputMediaDevice(v!);
                    }}
                    classNames={{
                      input: "mt-2",
                    }}
                    data={channelStore.mediaDeviceInfos
                      .filter((it) => it.kind === "audioinput")
                      .map((it) => ({
                        label: it.deviceId ? it.label : "未找到设备",
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
                    placeholder="请选择设备"
                    onChange={(v) => {
                      channelStore.setAudioDevice("outputDeviceId", v!);
                    }}
                    classNames={{
                      input: "mt-2",
                    }}
                    data={channelStore.mediaDeviceInfos
                      .filter((it) => it.kind === "audiooutput")
                      .map((it) => ({
                        label: it.deviceId ? it.label : "未找到设备",
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
        </Card>

        <Title order={5} className="mb-4 mt-8 text-white">
          其他设置
        </Title>

        <Card>
          <Observer>
            {() => (
              <>
                <Input.Wrapper label="AI降噪">
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
        </Card>
      </div>
    </div>
  );
};

export default SettingAudio;
