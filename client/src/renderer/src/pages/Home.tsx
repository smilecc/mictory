import { ActionIcon, Button, HoverCard, Menu, Modal, Select, Slider } from "@mantine/core";
import { IUserServer, ServerApi } from "@renderer/api";
import React, { useCallback, useEffect, useState } from "react";
import { useCommonStore } from "@renderer/stores";
import _ from "lodash";
import { Observer } from "mobx-react-lite";
import { CreateServerModal, JoinServerModal, ServerPanel } from "@renderer/components";
import { autorun, runInAction } from "mobx";
import { useNavigate } from "react-router-dom";
import { IconHomePlus, IconMicrophone, IconMicrophoneOff, IconPlus, IconSettings, IconSquarePlus, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { useReactive } from "ahooks";
import { SettingPage } from "./Setting";

type IViewdUserServer = IUserServer & {
  timestamp: number;
};

export const HomePage: React.FC = () => {
  const commonStore = useCommonStore();
  const navigate = useNavigate();
  const [userServers, setUserServers] = useState<IUserServer[]>([]);
  const [viewdServers, setViewdServers] = useState<IViewdUserServer[]>([]);
  const [joinedServer, setJoinedServer] = useState<IUserServer>();
  const state = useReactive({
    joinServerOpen: false,
    createServerOpen: false,
    settingOpen: false,
  });

  useEffect(
    () =>
      autorun(() => {
        setJoinedServer(userServers.find((it) => it.id === commonStore.joinedServerId));
      }),
    [userServers]
  );

  // 增加服务器浏览记录
  let appendViewdServer = useCallback((userServer: IUserServer) => {
    setViewdServers((pre) => pre.filter((it) => it.id !== userServer.id).concat([{ ...userServer, timestamp: new Date().getTime() }]));
  }, []);

  // 选择浏览一个服务器
  let selectServer = useCallback(
    (server: IUserServer) => {
      runInAction(() => {
        commonStore.viewServerId = server.id;
      });

      appendViewdServer(server);
    },
    [userServers]
  );

  // 加载用户服务器列表
  let loadUserServers = useCallback(() => {
    return ServerApi.listUserServers().then(({ data }) => {
      setUserServers(data.data);
      if (commonStore.viewServerId) {
        const server = data.data.find((it) => it.id === commonStore.viewServerId);
        server && appendViewdServer(server);
      }
      return data.data;
    });
  }, []);

  useEffect(() => {
    loadUserServers();
  }, []);

  return (
    <div className="flex h-full">
      <JoinServerModal
        opened={state.joinServerOpen}
        onClose={() => {
          state.joinServerOpen = false;
        }}
        onJoined={async (serverId) => {
          state.joinServerOpen = false;
          let servers = await loadUserServers();
          let server = servers.find((it) => it.id === parseInt(serverId));
          server && selectServer(server);
        }}
      />
      <CreateServerModal
        opened={state.createServerOpen}
        onClose={() => {
          state.createServerOpen = false;
        }}
        onCreated={async (serverId) => {
          state.createServerOpen = false;
          let servers = await loadUserServers();
          let server = servers.find((it) => it.id === serverId);
          server && selectServer(server);
        }}
      />
      <Modal
        title="设置"
        opened={state.settingOpen}
        onClose={() => (state.settingOpen = false)}
        size="90vw"
        styles={{
          inner: {
            paddingTop: 30,
            paddingBottom: 30,
          },
        }}
      >
        <SettingPage />
      </Modal>

      <div className="flex h-full w-1/4 flex-col overflow-y-auto bg-app-dark px-3 py-2 text-gray-400">
        {/* 频道列表 */}
        <div className="flex-1 select-none">
          {/* 选择服务器 */}
          <Observer>
            {() => (
              <div className="mb-3 flex items-center">
                <Select
                  className="flex-1"
                  placeholder="Pick one"
                  data={commonStore.connectServers.map((it) => it.host)}
                  value={commonStore.currentConnectServer?.host}
                  onChange={(e) => {
                    let selectServer = commonStore.connectServers.find((it) => it.host === e);
                    if (selectServer && selectServer.host !== commonStore.currentConnectServer?.host) {
                      commonStore.activeConnectServer(selectServer);
                      commonStore.loadUserInfo();
                      loadUserServers();
                    }
                  }}
                />
                <ActionIcon
                  className="ml-2"
                  variant="light"
                  size="lg"
                  onClick={() => {
                    navigate("/user/connect");
                  }}
                >
                  <IconPlus />
                </ActionIcon>
              </div>
            )}
          </Observer>
          {userServers.map((userServer) => (
            <Button
              fullWidth
              key={userServer.id}
              className={`
                mb-3 overflow-hidden text-ellipsis rounded-md bg-white/5 leading-none transition-all hover:bg-white/25 hover:text-white
               ${commonStore.viewServerId === userServer.id && "bg-white/20"}`}
              onClick={() => {
                selectServer(userServer);
              }}
            >
              {userServer.name}
            </Button>
          ))}
          <Menu width={200}>
            <Menu.Target>
              <Button leftIcon={<IconPlus size={15} />} fullWidth color="cyan" variant="outline">
                创建/加入频道
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconHomePlus />} onClick={() => (state.joinServerOpen = true)}>
                加入频道
              </Menu.Item>
              <Menu.Item icon={<IconSquarePlus />} onClick={() => (state.createServerOpen = true)}>
                创建频道
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        {/* 用户信息 */}
        <Observer>
          {() => (
            <div className="select-none rounded-md bg-zinc-800 p-2 pt-1">
              {/* 用户昵称 */}
              <div className="mb-1 flex items-center justify-between">
                <div className="text-md w-full overflow-hidden text-ellipsis leading-none text-zinc-200">
                  <HoverCard width={200} shadow="md" position="right">
                    <HoverCard.Target>
                      <span>{commonStore.userInfo?.nickname}</span>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      {commonStore.userInfo?.nickname}#{commonStore.userInfo?.nicknameNo}
                    </HoverCard.Dropdown>
                  </HoverCard>
                </div>
                <ActionIcon
                  className="mt-1"
                  onClick={() => {
                    // navigate("/setting");
                    state.settingOpen = true;
                  }}
                >
                  <IconSettings size={18} />
                </ActionIcon>
              </div>
              {commonStore.joinedServerId ? (
                <div className="mb-2 leading-none">
                  <div className="mb-3 text-zinc-200">{joinedServer?.name}</div>
                  <Button
                    fullWidth
                    onClick={() => {
                      runInAction(() => {
                        commonStore.session?.exitRoom();
                        commonStore.joinedServerId = 0;
                      });
                    }}
                  >
                    断开语音
                  </Button>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold">{commonStore.joinedServerId ? "语音已连接" : "语音未连接"}</div>
                <div className="flex">
                  {/* 麦克风音量 */}
                  <HoverCard width={200} withArrow openDelay={100}>
                    <HoverCard.Target>
                      <ActionIcon
                        onClick={() => {
                          const current = commonStore.gainSetting.microphone;
                          const history = commonStore.gainSetting.historyMicrophone || 100;
                          commonStore.setGainItem("microphone", commonStore.gainSetting.microphone ? 0 : history);
                          commonStore.setGainItem("historyMicrophone", current);
                        }}
                      >
                        {commonStore.gainSetting.microphone ? <IconMicrophone size={18} /> : <IconMicrophoneOff size={18} />}
                      </ActionIcon>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Slider max={300} labelAlwaysOn value={commonStore.gainSetting.microphone} onChange={(v) => commonStore.setGainItem("microphone", v)} />
                    </HoverCard.Dropdown>
                  </HoverCard>
                  {/* 播放音量 */}
                  <HoverCard width={200} withArrow openDelay={100}>
                    <HoverCard.Target>
                      <ActionIcon
                        className="ml-1"
                        onClick={() => {
                          const current = commonStore.gainSetting.volume;
                          const history = commonStore.gainSetting.historyVolume || 100;
                          commonStore.setGainItem("volume", commonStore.gainSetting.volume ? 0 : history);
                          commonStore.setGainItem("historyVolume", current);
                        }}
                      >
                        {commonStore.gainSetting.volume ? <IconVolume size={18} /> : <IconVolumeOff size={18} />}
                      </ActionIcon>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Slider max={300} labelAlwaysOn value={commonStore.gainSetting.volume} onChange={(v) => commonStore.setGainItem("volume", v)} />
                    </HoverCard.Dropdown>
                  </HoverCard>
                </div>
              </div>
            </div>
          )}
        </Observer>
      </div>

      {/* 频道信息 */}
      <div className="flex-1 select-none bg-app-dark">
        <Observer>
          {() => (
            <div className="flex h-full overflow-hidden rounded-tl-2xl bg-app-bg">
              {commonStore.viewServerId ? (
                viewdServers.map((server) => <ServerPanel key={server.id} server={server} visible={commonStore.viewServerId === server.id} />)
              ) : (
                <div className="flex flex-1 items-center justify-center text-zinc-400">请选择或加入一个频道</div>
              )}
            </div>
          )}
        </Observer>
      </div>
    </div>
  );
};
