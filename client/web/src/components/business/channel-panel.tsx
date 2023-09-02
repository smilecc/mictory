import { GetChannelDetailQuery } from "@/@generated/graphql";
import { SocketClientContext } from "@/contexts";
import { useChannelStore } from "@/stores";
import { Collapse } from "@mantine/core";
import { useReactive } from "ahooks";
import React, { Fragment, useCallback, useContext } from "react";
import { UserPopover } from "./user-popover";
import { IconUser } from "@tabler/icons-react";

export const ChannelPanel: React.FC<{
  channel: NonNullable<GetChannelDetailQuery["channels"][0]>;
  onShouldRefetch?: () => void;
}> = ({ channel, onShouldRefetch }) => {
  const socketClient = useContext(SocketClientContext);
  const channelStore = useChannelStore();
  const state = useReactive({
    closeCategories: [] as number[],
  });

  const onCategoryTitleClick = useCallback(
    (categoryId: number) => {
      if (state.closeCategories.includes(categoryId)) {
        state.closeCategories = state.closeCategories.filter((it) => it !== categoryId);
      } else {
        state.closeCategories.push(categoryId);
      }
    },
    [state],
  );

  return (
    <div className="px-2">
      {channel.categories?.map((it) => (
        <Fragment key={it.id}>
          <div
            className="mb-1 cursor-pointer select-none pl-2 text-xs text-foreground/50 transition-colors hover:text-foreground/70"
            onClick={() => onCategoryTitleClick(it.id)}
          >
            {it.name}
          </div>
          <Collapse in={!state.closeCategories.includes(it.id)}>
            {it.rooms?.map((room) => (
              <div key={room.id}>
                <div
                  className="cursor-pointer rounded-md p-3 font-bold leading-none text-zinc-300 hover:bg-zinc-700"
                  onDoubleClick={async () => {
                    await channelStore.joinRoom(room.id);

                    onShouldRefetch?.();

                    navigator.mediaDevices
                      .getUserMedia({
                        audio: true,
                        video: false,
                      })
                      .then((stream) => {
                        channelStore.createProducer(stream);
                      })
                      .catch(() => {
                        console.error("获取媒体设备失败");
                      });
                  }}
                >
                  {room.name}
                </div>
                <div className="pl-5">
                  {room.users.map((user) => (
                    <UserPopover key={user.id} nickname={user.nickname} no={user.nicknameNo}>
                      {/* ${speakingSessions.includes(user.sessionId) ? "bg-orange-500/25" : ""}`} */}
                      <div
                        className={`my-1 flex cursor-pointer items-center rounded-md px-3 py-2 text-sm leading-none text-zinc-300 hover:bg-zinc-700`}
                      >
                        <IconUser size={18} />
                        <span className="ml-1">{user.nickname}</span>
                      </div>
                    </UserPopover>
                  ))}
                </div>
              </div>
            ))}
          </Collapse>
        </Fragment>
      ))}
      {/* {channel.categories.map((room) => (
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
                    className={`my-1 flex cursor-pointer items-center rounded-md px-3 py-2 text-sm leading-none text-zinc-300 hover:bg-zinc-700 
              ${speakingSessions.includes(user.sessionId) ? "bg-orange-500/25" : ""}`}
                  >
                    <IconUser size={18} />
                    <span className="ml-1">{user.userNickname}</span>
                  </div>
                </UserPopover>
              ))}
          </div>
        </div>
      ))} */}
    </div>
  );
};
