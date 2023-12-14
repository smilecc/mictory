import { gql } from "@/@generated";
import { ChatTarget, FetchChatsQuery, SortOrder } from "@/@generated/graphql";
import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { last, first } from "lodash-es";
import { useReactive } from "ahooks";
import { ChatEditor, ChatPreview, ChatValue } from "./chat-editor";
import InfiniteScroll from "react-infinite-scroll-component";

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

export type ChatPannelProps = ChatPannelRoomProps | ChatPannelUserProps;

const FETCH =
  gql(`query fetchChats($where: ChatWhereInput!, $take: Int, $skip: Int, $cursor: ChatWhereUniqueInput, $order: SortOrder!) {
  chats(where: $where, skip: $skip, take: $take, cursor: $cursor, orderBy: { id: $order }) {
    id
    type
    user {
      id
      nickname
      avatar
    }
    targetUser {
      id
      nickname
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

  const state = useReactive({
    oldCursor: 0,
    newCursor: 0,
    lock: false,
    message: "",
  });

  const loadNext = useCallback(
    (type: "new" | "old") => {
      const sortOrder = type === "new" && state.newCursor !== 0 ? SortOrder.Asc : SortOrder.Desc;

      if (state.lock) {
        return;
      }

      state.lock = true;
      const cursor = type === "new" ? state.newCursor : state.oldCursor;

      fetchMore({
        variables: {
          order: sortOrder,
          where: {
            target: { equals: props.type },
            ...(props.type === ChatTarget.Room
              ? {
                  roomId: { equals: props.roomId },
                }
              : {}),
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
    [fetchMore, props.roomId, props.type, state],
  );

  useEffect(() => loadNext("new"), [loadNext]);

  const sendMessage = useCallback(
    async (v: ChatValue) => {
      console.log("chatValue", v, props.roomId);
      send({
        variables: {
          data: {
            message: v,
            target: ChatTarget.Room,
            room: { connect: { id: props.roomId } },
          },
        },
      }).finally(() => loadNext("new"));
    },
    [loadNext, props.roomId, send],
  );

  return (
    <div className="relative box-content h-full w-full">
      <div className="flex h-[calc(100%-4.5rem)] flex-col-reverse overflow-auto" ref={chatViewRef} id="aaa">
        {chatViewRef.current && (
          <InfiniteScroll
            next={() => loadNext("old")}
            hasMore={state.oldCursor !== -1}
            className="flex flex-col-reverse !overflow-hidden"
            loader={<h4>Loading...</h4>}
            endMessage={<h4>到头了</h4>}
            dataLength={chats.length}
            scrollableTarget={chatViewRef.current as unknown as React.ReactNode}
            scrollThreshold="400px"
            inverse
          >
            {chats.map((chat) => (
              <div key={chat.id}>
                <div>
                  {chat.id} - {chat.user?.nickname}
                </div>
                <ChatPreview value={chat.message} />
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 m-0 border-0 bg-surface1 p-3">
        <div className="flex items-end rounded-lg bg-surface5 px-3">
          <div className="pb-3">1</div>
          <div className="flex-1">
            <ChatEditor onEnterPress={sendMessage} />
          </div>
          <div className="pb-3">1</div>
        </div>
      </div>
    </div>
  );
};
