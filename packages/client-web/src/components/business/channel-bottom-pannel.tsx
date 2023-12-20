import { useChannelStore, useCommonStore } from "@/stores";
import { ActionIcon, Divider, Radio, Slider, Switch, Tooltip } from "@mantine/core";
import {
  IconBroadcast,
  IconMicrophone,
  IconMicrophoneOff,
  IconPlugX,
  IconSettings,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { Observer } from "mobx-react-lite";
import { useCallback } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { runInAction } from "mobx";

export const ChannelBottomPannel: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const commonStore = useCommonStore();
  const channelStore = useChannelStore();

  const handleAudioControlPanel = useCallback(() => {
    switch (channelStore.connectionState) {
      case "new":
        return <span className="">语音未连接</span>;
      case "connecting":
        return <span className="">语音连接中</span>;
      case "connected":
        return (
          <>
            <IconBroadcast size="18px" />
            <span className="ml-1.5">语音已连接</span>
          </>
        );

      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* 底部控制面板 */}
      <div {...props}>
        {/* 用户信息 */}
        <Observer>
          {() => (
            <div className="select-none bg-background/30 p-3">
              {channelStore.joinedChannel ? (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="flex items-end text-sm font-bold">
                        <Observer>{() => handleAudioControlPanel()}</Observer>
                      </div>
                      <div className="mt-0.5 text-xs text-foreground/40">{channelStore.joinedChannel.name}</div>
                    </div>
                    <div>
                      <Tooltip label="退出语音" position="right" color="dark">
                        <ActionIcon
                          onClick={async () => {
                            await channelStore.exitRoom();
                          }}
                        >
                          <IconPlugX size="26px" color="red" />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                  </div>
                  <Divider className="my-3" />
                </>
              ) : null}

              <div className="flex items-center justify-between">
                <div className="w-32 cursor-pointer">
                  <div className="overflow-hidden text-ellipsis text-sm text-foreground/80">
                    {channelStore.userWithChannels?.nickname}
                  </div>
                  <div className="overflow-hidden text-ellipsis text-xs text-foreground/40">
                    #{channelStore.userWithChannels?.nicknameNo}
                  </div>
                </div>
                <div className="flex">
                  <MicrophoneButton />
                  <VolumeButton />
                  {/* 用户设置 */}
                  <Tooltip label="用户设置" color="dark">
                    <ActionIcon
                      onClick={() => {
                        runInAction(() => {
                          commonStore.settingModalPath = "user/profile";
                        });
                      }}
                    >
                      <IconSettings size={18} />
                    </ActionIcon>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
        </Observer>
      </div>
    </>
  );
};

// 麦克风按钮
const MicrophoneButton: React.FC = () => {
  const channelStore = useChannelStore();

  console.log(channelStore);

  return (
    <Observer>
      {() => (
        <ContextMenu dir="ltr">
          <ContextMenuTrigger>
            <Tooltip label={channelStore.audioGain.microphone ? "麦克风静音" : "取消静音"} color="dark">
              <ActionIcon
                onClick={() => {
                  const current = channelStore.audioGain.microphone;
                  const history = channelStore.audioGain.historyMicrophone || 100;
                  channelStore.setAudioGainItem("microphone", current ? 0 : history);
                  channelStore.setAudioGainItem("historyMicrophone", current);
                }}
              >
                {channelStore.audioGain.microphone ? <IconMicrophone size={18} /> : <IconMicrophoneOff size={18} />}
              </ActionIcon>
            </Tooltip>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-80 select-none">
            <ContextMenuLabel>音频输入设置</ContextMenuLabel>
            <ContextMenuSeparator />
            <Radio.Group
              value={channelStore.audioDevice.inputDeviceId}
              onChange={(v) => {
                channelStore.setInputMediaDevice(v);
              }}
            >
              {channelStore.mediaDeviceInfos
                .filter((it) => it.kind === "audioinput")
                .map((it) => (
                  <ContextMenuItem key={it.deviceId} title={it.label}>
                    <Radio
                      classNames={{ label: "!cursor-pointer truncate w-64" }}
                      label={it.label}
                      value={it.deviceId}
                    />
                  </ContextMenuItem>
                ))}
            </Radio.Group>
            <ContextMenuSeparator />

            <Switch
              checked={channelStore.audioNoiseSuppression}
              onChange={() => channelStore.toggleNoiseSuppression()}
              labelPosition="left"
              radius="sm"
              className="p-2"
              label="AI降噪"
              onLabel="已开启"
              offLabel="已关闭"
            />

            <ContextMenuLabel className="text-xs">输入音量</ContextMenuLabel>
            <div className="p-2 pt-0">
              <Slider
                max={300}
                value={channelStore.audioGain.microphone}
                onChange={(v) => channelStore.setAudioGainItem("microphone", v)}
              />
            </div>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </Observer>
  );
};

// 麦克风按钮
const VolumeButton: React.FC = () => {
  const channelStore = useChannelStore();

  return (
    <Observer>
      {() => (
        <ContextMenu dir="ltr">
          <ContextMenuTrigger>
            <Tooltip label={channelStore.audioGain.volume ? "音量静音" : "取消静音"} color="dark">
              <ActionIcon
                onClick={() => {
                  const current = channelStore.audioGain.volume;
                  const history = channelStore.audioGain.historyVolume || 100;
                  channelStore.setAudioGainItem("volume", current ? 0 : history);
                  channelStore.setAudioGainItem("historyVolume", current);
                }}
              >
                {channelStore.audioGain.volume ? <IconVolume size={18} /> : <IconVolumeOff size={18} />}
              </ActionIcon>
            </Tooltip>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-80 select-none">
            <ContextMenuLabel>音频输出设置</ContextMenuLabel>
            <ContextMenuSeparator />
            <Radio.Group
              value={channelStore.audioDevice.outputDeviceId}
              onChange={(v) => {
                console.log(v);
                channelStore.setAudioDevice("outputDeviceId", v);
                // channelStore.setInputMediaDevice(v);
              }}
            >
              {channelStore.mediaDeviceInfos
                .filter((it) => it.kind === "audiooutput")
                .map((it) => (
                  <ContextMenuItem key={it.deviceId} title={it.label}>
                    <Radio
                      classNames={{ label: "!cursor-pointer truncate w-64" }}
                      label={it.label}
                      value={it.deviceId}
                    />
                  </ContextMenuItem>
                ))}
            </Radio.Group>
            <ContextMenuSeparator />

            <ContextMenuLabel className="text-xs">输出音量</ContextMenuLabel>
            <div className="p-2 pt-0">
              <Slider
                max={300}
                value={channelStore.audioGain.volume}
                onChange={(v) => channelStore.setAudioGainItem("volume", v)}
              />
            </div>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </Observer>
  );
};
