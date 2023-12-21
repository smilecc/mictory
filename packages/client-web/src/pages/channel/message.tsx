import { gql } from "@/@generated";
import { ChatTarget, FetchUserFriendsQuery, UserType } from "@/@generated/graphql";
import { ChannelBottomPannel, ChatPannel } from "@/components/business";
import { cn } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { Badge, Indicator } from "@mantine/core";
import { useReactive } from "ahooks";
import React, { useMemo } from "react";
import { first } from "lodash-es";
import { IconUsers } from "@tabler/icons-react";
import { DEFAULT_AVATAR } from "@/utils";
import { imgUrl } from "@/contexts";

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
        state.selectUser = friend.userA.id === state.selectUserId ? friend.userA : friend.userB;
      }
    },
  });
  const state = useReactive({
    selectUser: null as FriendItemData["userA"] | null,
    selectUserId: 0,
    selectFriendId: 0,
  });

  return (
    <div className="flex flex-1 bg-surface2">
      <div className="relative flex w-72 select-none flex-col border-0 border-r border-solid border-zinc-700">
        <div className="flex-1 overflow-y-auto p-4">
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
                state.selectUser = friend.userA.id === state.selectUserId ? friend.userA : friend.userB;
              }}
            />
          ))}
        </div>

        {/* 底部控制面板 */}
        <ChannelBottomPannel />
      </div>

      <div className="flex w-full flex-1 flex-col">
        {state.selectUserId ? (
          <>
            <div className="flex select-none items-center p-4 font-bold">
              <IconUsers size={20} />
              <span className="ml-2 text-lg">
                {state.selectUser?.nickname}#{state.selectUser?.nicknameNo}
              </span>
            </div>
            <div className="w-full flex-1 overflow-hidden">
              <ChatPannel type={ChatTarget.User} userId={state.selectUserId} key={`USER_CHAT_${state.selectUserId}`} />
            </div>
          </>
        ) : (
          <div />
        )}
      </div>
    </div>
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
      <Indicator inline offset={3} label="2" color="red" disabled>
        <img src={imgUrl(user.avatar, DEFAULT_AVATAR)} alt="avatar" className="h-7 w-7 rounded-full object-cover" />
      </Indicator>
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
