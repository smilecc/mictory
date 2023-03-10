import { LoadingOverlay, Title, Button, ActionIcon, Badge } from "@mantine/core";
import { IServerRoom, IServerUser, IUserServer, ServerApi } from "@renderer/api";
import { useCommonStore } from "@renderer/stores";
import { IconPlus, IconUser } from "@tabler/icons-react";
import { useEventListener, useInterval, useReactive, useThrottleFn } from "ahooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { runInAction } from "mobx";
import { useClipboard } from "@mantine/hooks";
import { CreateRoomModal } from "./CreateRoomModal";
import { Observer } from "mobx-react-lite";
import { UserPopover } from "./UserPopover";

export const ServerPanel: React.FC<{
  server: IUserServer;
  visible: boolean;
}> = (props) => {
  const clipboard = useClipboard({ timeout: 1000 });
  const commonStore = useCommonStore();
  const state = useReactive({
    serverId: 0,
    serverName: "",
    loading: false,
    createRoomOpen: false,
  });

  const [rooms, setRooms] = useState<IServerRoom[]>([]);
  const [users, setUsers] = useState<IServerUser[]>([]);
  const [speakingSessions, setSpeakingSessions] = useState<string[]>([]);

  // 用户列表会出现重复，根据在线状态排序，如果在线则优先保留在线记录
  let distinctUsers = useMemo(() => {
    const userMap = _.groupBy(users, (it) => it.userId);
    return Object.keys(userMap).map((key) => _.orderBy(userMap[key], (it) => (it.online ? 0 : 1))[0]);
  }, [users]);

  const onlineUsers = useMemo(() => distinctUsers.filter((it) => it.sessionOnline), [distinctUsers]);
  const offlineUsers = useMemo(() => distinctUsers.filter((it) => !it.sessionOnline), [distinctUsers]);

  const { run: queryServerInfo } = useThrottleFn(
    (serverId: number) => {
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
    },
    {
      wait: 1000,
      trailing: false,
    }
  );

  const loadServerInfo = useCallback((serverId: number, serverName: string) => {
    setSpeakingSessions([]);
    state.loading = true;
    state.serverName = serverName;
    state.serverId = serverId;
    commonStore.session?.auth(commonStore.accessToken!);
    queryServerInfo(serverId);
  }, []);

  useEffect(() => {
    if (props.visible) {
      loadServerInfo(props.server.id, props.server.name);
    } else {
      setSpeakingSessions([]);
    }
  }, [props.visible]);

  // 监听会话用户状态变化
  useEventListener("session:server_user_join", () => queryServerInfo(state.serverId), {
    target: window,
  });
  useEventListener("session:server_user_exit", () => queryServerInfo(state.serverId), {
    target: window,
  });

  // 固定每隔一段时间刷新一次服务器信息
  useInterval(() => {
    if (state.serverId && props.visible) {
      queryServerInfo(state.serverId);
    }
  }, 30 * 1000);

  useEventListener(
    "session:speak",
    (e: CustomEvent) => {
      if (props.visible) {
        setSpeakingSessions((pre) => [...new Set([...pre, e.detail.sessionId])]);
      }
    },
    {
      target: window,
    }
  );
  useEventListener(
    "session:stop_speak",
    (e: CustomEvent) => {
      if (props.visible) {
        setSpeakingSessions((pre) => pre.filter((it) => it !== e.detail.sessionId));
      }
    },
    {
      target: window,
    }
  );

  if (!props.visible) {
    return null;
  }

  return (
    <>
      <LoadingOverlay visible={state.loading} overlayBlur={2} overlayOpacity={0.05} />
      <CreateRoomModal
        serverId={state.serverId}
        opened={state.createRoomOpen}
        onClose={() => {
          state.createRoomOpen = false;
        }}
        onSuccess={() => {
          queryServerInfo(state.serverId);
          state.createRoomOpen = false;
        }}
      />

      <div className="flex flex-1 flex-col bg-zinc-800/70 pt-4 pb-2 text-gray-400">
        <Title order={2} className="mb-2 px-5 leading-none text-zinc-200">
          {state.serverName}
        </Title>
        <div className="mb-6 flex items-center px-5">
          <Badge className="mt-[1px]">频道ID: {state.serverId}</Badge>
          <Button
            className="ml-1"
            compact
            size="xs"
            variant="subtle"
            onClick={() => {
              clipboard.copy(state.serverId);
            }}
          >
            {clipboard.copied ? "ID已复制" : "复制"}
          </Button>
        </div>

        <Observer>
          {() => (
            <div className="mb-2 flex px-5 text-xs">
              <span>ROOMS</span>
              {commonStore.userInfo?.id === props.server.creatorId && (
                <ActionIcon size="xs" variant="filled" className="ml-2" onClick={() => (state.createRoomOpen = true)}>
                  <IconPlus size={13} />
                </ActionIcon>
              )}
            </div>
          )}
        </Observer>
        <div className="flex-1 overflow-y-auto px-2">
          {rooms.map((room) => (
            <div key={room.id}>
              <div
                className="cursor-pointer rounded-md p-3 font-bold leading-none text-zinc-300 hover:bg-zinc-700"
                onDoubleClick={() => {
                  runInAction(() => {
                    commonStore.session?.joinRoom(room.id.toString());
                    commonStore.joinedServerId = state.serverId;
                  });
                }}
              >
                {room.name}
              </div>
              <div>
                {users
                  .filter((it) => it.online && it.roomId === room.id)
                  .map((user) => (
                    <UserPopover key={user.id} userId={user.userId}>
                      <div
                        className={`my-1 flex cursor-pointer items-center rounded-md py-2 px-3 text-sm leading-none text-zinc-300 hover:bg-zinc-700 
                    ${speakingSessions.includes(user.sessionId) ? "bg-orange-500/25" : ""}`}
                      >
                        <IconUser size={18} />
                        <span className="ml-1">{user.userNickname}</span>
                      </div>
                    </UserPopover>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-60 py-3 px-2 text-zinc-300">
        {onlineUsers.length > 0 && (
          <div className="mb-3">
            <div className="px-2 text-xs font-bold">在线 - {onlineUsers.length}</div>
            {onlineUsers.map((user) => (
              <UserPopover key={user.id} userId={user.userId}>
                <div className="my-1 flex cursor-pointer items-center rounded-md py-2 px-2 text-sm leading-none text-zinc-300 hover:bg-zinc-700">
                  <IconUser size={18} />
                  <span className="ml-1">{user.userNickname}</span>
                </div>
              </UserPopover>
            ))}
          </div>
        )}

        {offlineUsers.length > 0 && (
          <>
            <div className="px-2 text-xs font-bold">离线 - {offlineUsers.length}</div>
            {offlineUsers.map((user) => (
              <UserPopover key={user.id} userId={user.userId}>
                <div className="my-1 flex cursor-pointer items-center rounded-md py-2 px-2 text-sm leading-none text-zinc-300 opacity-50 hover:bg-zinc-700">
                  <IconUser size={18} />
                  <span className="ml-1">{user.userNickname}</span>
                </div>
              </UserPopover>
            ))}
          </>
        )}
      </div>
    </>
  );
};
