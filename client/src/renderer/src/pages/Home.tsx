import { Button, LoadingOverlay, Title } from "@mantine/core";
import { IServerRoom, IServerUser, IUserServer, ServerApi } from "@renderer/api";
import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useEventListener, useInterval, useReactive } from "ahooks";
import { useCommonStore } from "@renderer/stores";
import { IconUser } from "@tabler/icons-react";
import _ from "lodash";

export const HomePage: React.FC = () => {
  // const navigate = useNavigate();
  const commonStore = useCommonStore();
  const [userServers, setUserServers] = useState<IUserServer[]>([]);
  const [rooms, setRooms] = useState<IServerRoom[]>([]);
  const [users, setUsers] = useState<IServerUser[]>([]);
  const [speakingSessions, setSpeakingSessions] = useState<string[]>([]);

  // 用户列表会出现重复，根据在线状态排序，如果在线则优先保留在线记录
  let distinctUsers = useMemo(() => {
    const userMap = _.groupBy(users, (it) => it.userId);
    return Object.keys(userMap).map(
      (key) => _.orderBy(userMap[key], (it) => (it.online ? 0 : 1))[0]
    );
  }, [users]);

  const onlineUsers = useMemo(() => distinctUsers.filter((it) => it.online), [distinctUsers]);
  const offlineUsers = useMemo(() => distinctUsers.filter((it) => !it.online), [distinctUsers]);

  const state = useReactive({
    serverId: 0,
    serverName: "",
    joinedServerId: 0,
    joinedServerName: "",
    loading: false,
  });

  useEffect(() => {
    ServerApi.listUserServers().then(({ data }) => {
      setUserServers(data.data);
    });
  }, []);

  const queryServerInfo = useCallback((serverId: number) => {
    Promise.all([ServerApi.listServerRooms(serverId), ServerApi.listServerUsers(serverId)])
      .then(
        ([
          {
            data: { data: rooms },
          },
          {
            data: { data: users },
          },
        ]) => {
          setRooms(rooms);
          setUsers(users);
        }
      )
      .finally(() => {
        state.loading = false;
      });
  }, []);

  const loadServerInfo = useCallback((serverId: number, serverName: string) => {
    setSpeakingSessions([]);
    state.loading = true;
    state.serverName = serverName;
    state.serverId = serverId;
    commonStore.session.auth(commonStore.accessToken!);
    queryServerInfo(serverId);
  }, []);

  // 监听会话用户状态变化
  useEventListener("session:server_user_join", () => queryServerInfo(state.serverId), {
    target: window,
  });
  useEventListener("session:server_user_exit", () => queryServerInfo(state.serverId), {
    target: window,
  });

  // 固定每隔一段时间刷新一次服务器信息
  useInterval(() => {
    if (state.serverId) {
      queryServerInfo(state.serverId);
    }
  }, 30 * 1000);

  useEventListener(
    "session:speak",
    (e: CustomEvent) => {
      console.log("session:speak", e.detail.sessionId);
      setSpeakingSessions((pre) => [...new Set([...pre, e.detail.sessionId])]);
    },
    {
      target: window,
    }
  );
  useEventListener(
    "session:stop_speak",
    (e: CustomEvent) => {
      console.log("session:stop_speak", e.detail.sessionId);
      setSpeakingSessions((pre) => pre.filter((it) => it !== e.detail.sessionId));
    },
    {
      target: window,
    }
  );

  return (
    <div className="flex h-full">
      <LoadingOverlay visible={state.loading} overlayBlur={2} overlayOpacity={0.05} />
      <div className="flex h-full w-1/4 flex-col overflow-y-auto bg-app-dark px-3 py-2 text-gray-400">
        {/* 服务器列表 */}
        <div className="flex-1">
          {userServers.map((userServer) => (
            <div
              className="mb-3 cursor-pointer overflow-hidden text-ellipsis rounded-md bg-white/5 p-3 leading-none transition-all hover:bg-white/20 hover:text-white"
              onClick={() => loadServerInfo(userServer.id, userServer.name)}
            >
              {userServer.name}
            </div>
          ))}
        </div>
        {/* 用户信息 */}
        <div className="rounded-md bg-zinc-800 p-2">
          {state.joinedServerId ? (
            <div className="leading-none">
              <div className="mb-2 text-xs font-bold">语音已连接</div>
              <div className="mb-3 text-zinc-200">{state.serverName}</div>
              <Button
                fullWidth
                onClick={() => {
                  commonStore.session.exitRoom();
                  state.joinedServerId = 0;
                  state.joinedServerName = "";
                }}
              >
                断开语音
              </Button>
            </div>
          ) : (
            <div className="text-xs font-bold">语音未连接</div>
          )}
        </div>
      </div>

      {/* 服务器信息 */}
      <div className="flex-1 select-none bg-app-dark">
        <div className="flex h-full overflow-hidden rounded-tl-2xl bg-app-bg">
          {state.serverId ? (
            <>
              <div className="flex-1 bg-zinc-800/70 py-4 text-gray-400">
                <Title order={2} className="mb-6 px-5 leading-none">
                  {state.serverName}
                </Title>
                <div className="mb-2 px-5 text-xs">ROOMS</div>
                <div className="px-2">
                  {rooms.map((room) => (
                    <>
                      <div
                        className="cursor-pointer rounded-md p-3 font-bold leading-none text-zinc-300 hover:bg-zinc-700"
                        onDoubleClick={() => {
                          commonStore.session.joinRoom(room.id.toString());
                          state.joinedServerId = state.serverId;
                          state.joinedServerName = state.serverName;
                        }}
                      >
                        {room.name}
                      </div>
                      <div>
                        {users
                          .filter((it) => it.online && it.roomId === room.id)
                          .map((user) => (
                            <div
                              className={`my-1 flex cursor-pointer items-center rounded-md py-2 px-3 text-sm leading-none text-zinc-300 hover:bg-zinc-700 
                              ${
                                speakingSessions.includes(user.sessionId) ? "bg-orange-500/25" : ""
                              }`}
                            >
                              <IconUser size={18} />
                              <span className="ml-1">{user.userNickname}</span>
                            </div>
                          ))}
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div className="w-60 p-3 text-zinc-300">
                {onlineUsers.length > 0 && (
                  <div className="mb-2">
                    <div className="text-sm">在线 - {onlineUsers.length}</div>
                    {onlineUsers.map((user) => (
                      <div>{user.userNickname}</div>
                    ))}
                  </div>
                )}

                {offlineUsers.length > 0 && (
                  <>
                    <div className="text-sm">离线 - {offlineUsers.length}</div>
                    {offlineUsers.map((user) => (
                      <div>{user.userNickname}</div>
                    ))}
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-zinc-400">
              请选择或加入一个服务器
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
