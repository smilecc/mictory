import { gql } from "@/@generated";
import { ChatTarget, FetchUserFriendsQuery, UserType } from "@/@generated/graphql";
import { ChatPannel } from "@/components/business";
import { BaseLayout } from "@/components/layout/base-layout";
import { cn } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { Badge } from "@mantine/core";
import { useReactive } from "ahooks";
import React, { useMemo } from "react";
import { first } from "lodash-es";

const FETCH_FRIENDS = gql(`query fetchUserFriends {
  currentUser: user(where: { nicknameNo: { equals: -1 } }) {
    id
    nickname
    nicknameNo
  }

  userFriends {
    id
    userAAccept
    userBAccept
    lastChatTime
    userA {
      id
      nickname
      nicknameNo
      avatar
      type
    }
    userB {
      id
      nickname
      nicknameNo
      avatar
      type
    }
  }
}`);

type FriendItemData = NonNullable<FetchUserFriendsQuery["userFriends"][0]>;
type CurrentUser = NonNullable<FetchUserFriendsQuery["currentUser"]>;

function getFriendUserId(current: number, aUserId: number, bUserId: number) {
  if (current === aUserId) {
    return bUserId;
  } else {
    return aUserId;
  }
}

export const MessagePage: React.FC = () => {
  const { data } = useQuery(FETCH_FRIENDS, {
    onCompleted(data) {
      const friend = first(data.userFriends);
      if (!state.selectFriendId && friend) {
        state.selectFriendId = friend.id;
        state.selectUserId = getFriendUserId(data.currentUser!.id, friend.userA.id, friend.userB.id);
      }
    },
  });
  const state = useReactive({
    selectUserId: 0,
    selectFriendId: 0,
  });

  return (
    <BaseLayout>
      <div className="flex flex-1 bg-surface2">
        <div className="w-72 select-none border-0 border-r border-solid border-zinc-700 p-4">
          {data?.currentUser ? (
            <div className="mb-4 text-lg font-bold">
              {data.currentUser.nickname}#{data.currentUser.nicknameNo}
            </div>
          ) : null}

          {data?.userFriends.map((friend) => (
            <FriendItem
              key={friend.id}
              active={state.selectFriendId === friend.id}
              currentUser={data.currentUser!}
              friend={friend}
              onClick={(userId, id) => {
                state.selectUserId = userId;
                state.selectFriendId = id;
              }}
            />
          ))}
        </div>

        {state.selectUserId ? (
          <div className="h-full w-full">
            <ChatPannel type={ChatTarget.User} userId={state.selectUserId} key={state.selectUserId} />
          </div>
        ) : null}
      </div>
    </BaseLayout>
  );
};

const FriendItem: React.FC<{
  friend: FriendItemData;
  currentUser: CurrentUser;
  onClick?: (userId: number, id: number) => void;
  active?: boolean;
}> = ({ friend, currentUser, onClick, active }) => {
  const user = useMemo(() => {
    if (currentUser.id === friend.userA.id) {
      return friend.userB;
    } else {
      return friend.userA;
    }
  }, [currentUser.id, friend.userA, friend.userB]);

  return (
    <div
      className={cn(
        "mb-1 flex cursor-pointer items-center rounded-md px-3 py-1.5 text-zinc-300 transition-colors hover:bg-zinc-700",
        active ? "!bg-zinc-700" : "",
      )}
      onClick={() => onClick?.(user.id, friend.id)}
    >
      <img src={user.avatar || "/img/default-avatar.jpg"} alt="avatar" className="h-7 w-7 rounded-full object-cover" />
      <div className="ml-2">
        <span>{user.nickname}</span>
        {user.type === UserType.System ? (
          <Badge className="ml-2" variant="outline" color="red">
            系统
          </Badge>
        ) : null}
        {user.type === UserType.Admin ? (
          <Badge className="ml-2" variant="outline" color="blue">
            管理员
          </Badge>
        ) : null}
      </div>
    </div>
  );
};
