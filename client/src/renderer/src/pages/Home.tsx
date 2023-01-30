import { ActionIcon, Button, HoverCard, Select } from "@mantine/core";
import { IUserServer, ServerApi } from "@renderer/api";
import React, { useCallback, useEffect, useState } from "react";
import { useCommonStore } from "@renderer/stores";
import _ from "lodash";
import { Observer } from "mobx-react-lite";
import { JoinServerModal, ServerPanel } from "@renderer/components";
import { autorun, runInAction } from "mobx";
import { useNavigate } from "react-router-dom";
import { IconPlus, IconSettings } from "@tabler/icons-react";
import { useReactive } from "ahooks";

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
                    if (selectServer) {
                      commonStore.activeConnectServer(selectServer);
                      commonStore.loadUserInfo();
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
          <Button
            leftIcon={<IconPlus size={15} />}
            fullWidth
            color="cyan"
            variant="outline"
            onClick={() => {
              state.joinServerOpen = true;
            }}
          >
            加入频道
          </Button>
        </div>
        {/* 用户信息 */}
        <Observer>
          {() => (
            <div className="select-none rounded-md bg-zinc-800 p-2 pt-1">
              {/* 用户昵称 */}
              <div className="mb-2 flex items-center justify-between">
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
                    navigate("/setting");
                  }}
                >
                  <IconSettings size={18} />
                </ActionIcon>
              </div>
              {commonStore.joinedServerId ? (
                <div className="leading-none">
                  <div className="mb-2 text-xs font-bold">语音已连接</div>
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
              ) : (
                <div className="text-xs font-bold">语音未连接</div>
              )}
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
