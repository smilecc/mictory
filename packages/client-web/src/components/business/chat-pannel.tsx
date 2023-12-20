import { gql } from "@/@generated";
import { ChatTarget, FetchChatsQuery, SortOrder } from "@/@generated/graphql";
import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { last, first } from "lodash-es";
import { useDebounceFn, useEventListener, useReactive } from "ahooks";
import { ChatEditor, ChatPreview, ChatValue } from "./chat-editor";
import InfiniteScroll from "react-infinite-scroll-component";
import dayjs from "dayjs";
import { UserPopover } from ".";
import { ActionIcon, Divider, FileButton, Popover, Skeleton } from "@mantine/core";
import EmojiPicker, { Categories, EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import { IconMoodSmileBeam, IconPhoto } from "@tabler/icons-react";
import { PlateEditor, nanoid } from "@udecode/plate-common";
import { ApiAxiosUpload, DEFAULT_AVATAR } from "@/utils";
import { NewChatMessageEvent } from "@mictory/common";
import { cn } from "@/lib/utils";

export type ChatPannelRoomProps = {
  type: ChatTarget.Room;
  roomId: number;
  userId?: number;
};

export type ChatPannelUserProps = {
  type: ChatTarget.User;
  userId: number;
  roomId?: number;
};

export type ChatPannelProps = (ChatPannelRoomProps | ChatPannelUserProps) & {
  className?: string;
};

const FETCH =
  gql(`query fetchChats($target: ChatTarget!, $where: ChatWhereInput!, $take: Int, $skip: Int, $cursor: ChatWhereUniqueInput, $order: SortOrder!) {
  chats(target: $target, where: $where, skip: $skip, take: $take, cursor: $cursor, orderBy: { id: $order }) {
    id
    type
    user {
      id
      nickname
      nicknameNo
      avatar
    }
    targetUser {
      id
      nickname
      nicknameNo
      avatar
    }
    message
    createdTime
  }
}`);

const SEND = gql(`mutation sendChatMessage($data: ChatCreateInput!) {
  createChatMessage(data: $data) {
    id
  }
}`);

type ChatItem = NonNullable<FetchChatsQuery["chats"][0]>;

export const ChatPannel: React.FC<ChatPannelProps> = (props) => {
  const [send] = useMutation(SEND);
  const [fetchMore] = useLazyQuery(FETCH);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const chatViewRef = useRef<HTMLDivElement>(null);
  const chatEditorRef = useRef<PlateEditor>(null);

  const state = useReactive({
    oldCursor: 0,
    newCursor: 0,
    lock: false,
    sending: false,
    message: "",
  });

  // 监听新消息
  useEventListener(
    "chat:newMessage",
    async (e: CustomEvent<NewChatMessageEvent>) => {
      console.log("ChatPanel -> newChatMessage", e.detail);
      await loadNextAtNow("new");
    },
    {
      target: window,
    },
  );

  const loadNextAtNow = useCallback(
    async (type: "new" | "old") => {
      const sortOrder = type === "new" && state.newCursor !== 0 ? SortOrder.Asc : SortOrder.Desc;

      if (state.lock) {
        return;
      }

      state.lock = true;
      const cursor = type === "new" ? state.newCursor : state.oldCursor;

      await fetchMore({
        variables: {
          target: props.type,
          order: sortOrder,
          where: {
            ...(props.type === ChatTarget.Room
              ? {
                  roomId: { equals: props.roomId },
                }
              : {
                  OR: [
                    {
                      userId: { equals: props.userId },
                    },
                    {
                      targetUserId: { equals: props.userId },
                    },
                  ],
                }),
          },
          take: 20,
          ...(cursor
            ? {
                skip: 1,
                cursor: {
                  id: cursor,
                },
              }
            : {}),
        },
      })
        .then((data) => {
          const chats = (data.data?.chats || []).sort((a, b) => b.id - a.id);
          setChats((pre) => (type === "new" ? chats.concat(pre) : pre.concat(chats)));

          const newCursor: number = first(chats)?.id || -1;
          const oldCursor: number = last(chats)?.id || -1;

          if (type === "old" && oldCursor === -1) {
            state.oldCursor = -1;
          } else if ((oldCursor < state.oldCursor && oldCursor !== -1) || state.oldCursor === 0) {
            state.oldCursor = oldCursor;
          }

          if (newCursor > state.newCursor) {
            state.newCursor = newCursor;
          }
        })
        .finally(() => {
          state.lock = false;
          if (type === "new") {
            setTimeout(() => {
              chatViewRef.current?.scrollTo({
                top: chatViewRef.current.scrollHeight,
                behavior: "smooth",
              });
            }, 200);
          }
        });
    },
    [fetchMore, props.roomId, props.type, props.userId, state],
  );

  const { run: loadNext } = useDebounceFn(loadNextAtNow, { wait: 200 });

  useEffect(() => {
    loadNext("new");
  }, [loadNext]);

  const sendMessage = useCallback(
    async (v: ChatValue, plainText: string) => {
      state.sending = true;
      try {
        await send({
          variables: {
            data: {
              message: v,
              plainText,
              target: props.type,
              ...(props.type === ChatTarget.Room
                ? {
                    room: { connect: { id: props.roomId } },
                  }
                : {
                    targetUser: { connect: { id: props.userId } },
                  }),
            },
          },
        });
        await loadNextAtNow("new");
      } finally {
        state.sending = false;
      }
    },
    [loadNextAtNow, props.roomId, props.type, props.userId, send, state],
  );

  return (
    <div className={cn("relative box-content h-full w-full", props.className)}>
      <div className="flex h-[calc(100%-4.5rem)] flex-col-reverse overflow-auto" ref={chatViewRef} id="aaa">
        {chatViewRef.current && (
          <InfiniteScroll
            next={() => loadNext("old")}
            hasMore={state.oldCursor !== -1}
            className="flex flex-col-reverse !overflow-hidden"
            loader={<ChatLoader />}
            endMessage={
              <div className="select-none px-2 py-4">
                <Divider my="xs" label="没有更多啦" size="sm" labelPosition="center" />
              </div>
            }
            dataLength={chats.length}
            scrollableTarget={chatViewRef.current as unknown as React.ReactNode}
            scrollThreshold="400px"
            inverse
          >
            {chats.map((chat) => (
              <div key={chat.id} className="flex p-3 transition-colors duration-75 hover:bg-surface3">
                <UserPopover nickname={chat.user!.nickname} no={chat.user!.nicknameNo}>
                  <img
                    src={chat.user?.avatar || DEFAULT_AVATAR}
                    alt="avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </UserPopover>

                <div className="ml-3">
                  <div>
                    <span className="font-bold">{chat.user?.nickname}</span>
                    <ChatMessageTime time={chat.createdTime} />
                  </div>
                  <ChatPreview value={chat.message} />
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 m-0 border-0 bg-surface1 py-2 pl-3 pr-2">
        {state.sending && <div className="absolute -top-4 left-8 select-none text-xs text-gray-300">消息发送中...</div>}
        <div className="flex items-end rounded-lg bg-surface5 pl-3">
          <FileButton
            accept="image/png,image/jpeg,image/gif"
            onChange={(file) => {
              if (file) {
                state.sending = true;
                ApiAxiosUpload(file).then(({ data }) => {
                  sendMessage(
                    [
                      {
                        id: nanoid(),
                        url: data.name,
                        type: "img",
                        width: 300,
                        children: [{ text: "" }],
                      },
                    ],
                    "[图片]",
                  );
                });
              }
            }}
          >
            {(props) => (
              <ActionIcon className="pb-4" {...props}>
                <IconPhoto size={26} className="text-gray-400" />
              </ActionIcon>
            )}
          </FileButton>

          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon className="ml-2 pb-4">
                <IconMoodSmileBeam size={26} className="text-gray-400" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown className="p-0">
              <ChatEmojiPicker
                onEmojiClick={(emoji) => {
                  // 如果没有选区，则重新插入一个节点作为被写入的目标
                  if (!chatEditorRef.current?.selection) {
                    chatEditorRef.current?.removeNodes({
                      at: {
                        path: [0, 0],
                        offset: 0,
                      },
                    });

                    chatEditorRef.current?.insertNode({
                      children: [{ text: "" }],
                      type: "p",
                    });
                  }

                  chatEditorRef.current?.insertText(emoji.emoji);
                }}
              />
            </Popover.Dropdown>
          </Popover>

          <div className="twp flex-1">
            <ChatEditor onEnterPress={async (v, plainText) => sendMessage(v, plainText)} editorRef={chatEditorRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatMessageTime: React.FC<{ time: Date }> = React.memo((props) => {
  const timeStr = useMemo(() => dayjs(props.time).format("YYYY-MM-DD HH:mm"), [props.time]);

  return <span className="ml-2 select-none text-[10px] text-gray-400">{timeStr}</span>;
});

const LOADER_COUNTER = new Array(3).fill(1);

const ChatLoader: React.FC = React.memo(() => {
  return (
    <>
      {LOADER_COUNTER.map((_, idx) => (
        <div key={`loader-${idx}`} className="flex p-3 duration-75 hover:bg-surface3">
          <Skeleton height={50} circle mb="xl" />

          <div className="ml-3 w-full">
            <Skeleton height={16} width={100} radius="xl" />
            <Skeleton height={12} width="70%" mt={10} radius="xl" />
            <Skeleton height={12} width="50%" mt={10} radius="xl" />
          </div>
        </div>
      ))}
    </>
  );
});

const ChatEmojiPicker: React.FC<{
  onEmojiClick?: (emoji: EmojiClickData, event: MouseEvent) => void;
}> = React.memo(({ onEmojiClick }) => {
  return (
    <EmojiPicker
      onEmojiClick={onEmojiClick}
      theme={Theme.DARK}
      skinTonesDisabled
      emojiStyle={EmojiStyle.NATIVE}
      lazyLoadEmojis
      searchPlaceHolder="搜索"
      categories={[
        {
          category: Categories.SUGGESTED,
          name: "最近常用",
        },
        {
          category: Categories.SMILEYS_PEOPLE,
          name: "人物",
        },
        {
          category: Categories.ANIMALS_NATURE,
          name: "动物",
        },
        {
          category: Categories.FOOD_DRINK,
          name: "食品",
        },
        {
          category: Categories.TRAVEL_PLACES,
          name: "旅行",
        },
        {
          category: Categories.FLAGS,
          name: "旗帜",
        },
        {
          category: Categories.OBJECTS,
          name: "物体",
        },
        {
          category: Categories.SYMBOLS,
          name: "符号",
        },
      ]}
    />
  );
});
