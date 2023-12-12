import { gql } from "@/@generated";
import { ChatTarget, FetchChatsQuery } from "@/@generated/graphql";
import { useLazyQuery } from "@apollo/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { last } from "lodash-es";
import { useReactive } from "ahooks";

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

const FETCH = gql(`query fetchChats($where: ChatWhereInput!, $take: Int, $skip: Int, $cursor: ChatWhereUniqueInput) {
  chats(where: $where, skip: $skip, take: $take, cursor: $cursor, orderBy: { id: desc }) {
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

type ChatItem = NonNullable<FetchChatsQuery["chats"][0]>;

export const ChatPannel: React.FC<ChatPannelProps> = (props) => {
  const [fetchMore] = useLazyQuery(FETCH);
  const [chats, setChats] = useState<ChatItem[]>([]);

  const state = useReactive({
    cursor: 0,
    lastId: "",
    lock: false,
  });

  const currentId = useMemo(
    () => `${props.type}-${props.type === ChatTarget.Room ? props.roomId : props.userId}`,
    [props.roomId, props.type, props.userId],
  );

  const loadNext = useCallback(() => {
    if (currentId !== state.lastId) {
      state.cursor = 0;
      state.lock = false;
      setChats([]);
    }

    state.lastId = currentId;
    if (state.cursor === -1 || state.lock) {
      return;
    }

    state.lock = true;
    fetchMore({
      variables: {
        where: {
          target: { equals: props.type },
          ...(props.type === ChatTarget.Room
            ? {
                roomId: { equals: props.roomId },
              }
            : {}),
        },
        take: 20,
        ...(state.cursor
          ? {
              skip: 1,
              cursor: {
                id: state.cursor,
              },
            }
          : {}),
      },
    })
      .then((data) => {
        setChats((pre) => pre.concat(data.data?.chats || []));
        state.cursor = last(data.data?.chats)?.id || -1;
      })
      .finally(() => {
        state.lock = false;
      });
  }, [currentId, fetchMore, props.roomId, props.type, state]);

  useEffect(() => loadNext(), [loadNext, currentId]);

  return (
    <div>
      <div>{JSON.stringify(chats)}</div>
      <div>{state.cursor}</div>
      <div>lastId: {state.lastId}</div>
      <button onClick={loadNext}>next</button>
    </div>
  );
};
