import { GetChannelDetailQuery } from "@/@generated/graphql";
import { useChannelStore } from "@/stores";
import { Collapse } from "@mantine/core";
import { useEventListener, useReactive } from "ahooks";
import React, { Fragment, useCallback, useState } from "react";
import { UserPopover } from "./user-popover";
import { IconUser } from "@tabler/icons-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { DropdownMenuLabel } from "../ui/dropdown-menu";

export const ChannelPanel: React.FC<{
  channel: NonNullable<GetChannelDetailQuery["channels"][0]>;
  onShouldRefetch?: () => void;
  onRoomClick?: (roomId: number) => void;
  onJoinRoom?: (roomId: number) => void;
}> = ({ channel, onShouldRefetch, onRoomClick, onJoinRoom }) => {
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
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className="mb-1 mt-2 cursor-pointer select-none pl-2 text-xs text-foreground/50 transition-colors hover:text-foreground/70"
                onClick={() => onCategoryTitleClick(it.id)}
              >
                {it.name}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <DropdownMenuLabel>{it.name}</DropdownMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuItem>编辑分组</ContextMenuItem>
              <ContextMenuItem className="text-red-500">删除分组</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <Collapse in={!state.closeCategories.includes(it.id)}>
            {/* 房间列表 */}
            {it.rooms?.map((room) => (
              <div key={room.id} className="select-none">
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div
                      className="cursor-pointer rounded-md p-3 font-bold leading-none text-zinc-300 hover:bg-zinc-700"
                      onClick={() => {
                        onRoomClick?.(room.id);
                      }}
                      onDoubleClick={async () => {
                        onRoomClick?.(room.id);
                        await channelStore.joinRoom(room.id, room.channelId);

                        onJoinRoom?.(room.id);
                        onShouldRefetch?.();

                        // 创建消费者
                        const stream = await channelStore.getUserAudioMedia();
                        channelStore.createProducer(stream);
                      }}
                    >
                      {room.name}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <DropdownMenuLabel>{room.name}</DropdownMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuItem>邀请</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>编辑房间</ContextMenuItem>
                    <ContextMenuItem className="text-red-500">删除房间</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>

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
