import { GetChannelDetailQuery } from "@/@generated/graphql";
import { useChannelStore } from "@/stores";
import { Collapse } from "@mantine/core";
import { useEventListener, useReactive } from "ahooks";
import React, { Fragment, useCallback, useState } from "react";
import { UserPopover } from "./user-popover";
import { IconUser } from "@tabler/icons-react";

export const ChannelPanel: React.FC<{
  channel: NonNullable<GetChannelDetailQuery["channels"][0]>;
  onShouldRefetch?: () => void;
}> = ({ channel, onShouldRefetch }) => {
  const channelStore = useChannelStore();
  const [speakingUsers, setSpeakingUsers] = useState<number[]>([]);
  const state = useReactive({
    closeCategories: [] as number[],
  });

  // 监听用户说话
  useEventListener(
    "user:speak",
    (e: CustomEvent) => {
      setSpeakingUsers((pre) => [...new Set([...pre, e.detail.userId])]);
    },
    {
      target: window,
    },
  );

  useEventListener(
    "user:stop_speak",
    (e: CustomEvent) => {
      setSpeakingUsers((pre) => pre.filter((it) => it !== e.detail.userId));
    },
    {
      target: window,
    },
  );

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
              <div key={room.id} className="select-none">
                <div
                  className="cursor-pointer rounded-md p-3 font-bold leading-none text-zinc-300 hover:bg-zinc-700"
                  onDoubleClick={async () => {
                    await channelStore.joinRoom(room.id, room.channelId);

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
                        // 创建一个空白媒体流
                        channelStore.createProducer(new AudioContext().createMediaStreamDestination().stream);
                      });
                  }}
                >
                  {room.name}
                </div>
                <div className="pl-5">
                  {room.users.map((user) => (
                    <UserPopover key={user.id} nickname={user.nickname} no={user.nicknameNo}>
                      <div
                        className={`my-1 flex cursor-pointer items-center rounded-md px-3 py-2 text-sm leading-none text-zinc-300 hover:bg-zinc-700
                          ${speakingUsers.includes(user.id) ? "bg-orange-500/25" : ""}
                        `}
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
    </div>
  );
};
