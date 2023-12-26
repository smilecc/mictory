import { IconSwtich } from "@/components/ui/icon-switch";
import { cn } from "@/lib/utils";
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

        <Card className="overflow-visible p-6">
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

        <Card className="p-6">
          <Observer>
            {() => (
              <>
                <SettingIconSwtich
                  label="AI降噪"
                  description="使用免费的AI降噪降低环境声"
                  checked={channelStore.audioNoiseSuppression}
                  onChange={() => channelStore.toggleNoiseSuppression()}
                />
                <SettingIconSwtich
                  className="mt-6"
                  label="回音抵消"
                  description="抵消音响传入麦克风的回声"
                  checked={channelStore.audioDevice.echoCancellation}
                  onChange={(e) => channelStore.setAudioDevice("echoCancellation", e)}
                />
                <SettingIconSwtich
                  className="mt-6"
                  label="自动声音增益"
                  description="自动放大您的麦克风声音"
                  checked={channelStore.audioDevice.autoGainControl}
                  onChange={(e) => channelStore.setAudioDevice("autoGainControl", e)}
                />
              </>
            )}
          </Observer>
        </Card>
      </div>
    </div>
  );
};

const SettingIconSwtich: React.FC<{
  className?: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (e: boolean) => void;
}> = ({ className, label, description, checked, onChange }) => {
  return (
    <Input.Wrapper
      label={
        <div>
          <div className="text-base text-white">{label}</div>
          <div className="mt-0.5 text-xs">{description}</div>
        </div>
      }
      className={cn("flex items-center justify-between", className)}
    >
      <IconSwtich
        size="md"
        classNames={{
          trackLabel: "!text-xs",
        }}
        onLabel="ON"
        offLabel="OFF"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </Input.Wrapper>
  );
};

export default SettingAudio;
