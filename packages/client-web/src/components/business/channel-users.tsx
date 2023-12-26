import { GetChannelDetailQuery, UserSessionState } from "@/@generated/graphql";
import React, { useMemo } from "react";
import { UserPopover } from ".";
import { DEFAULT_AVATAR } from "@/utils";
import { imgUrl } from "@/contexts";

type Users = NonNullable<NonNullable<GetChannelDetailQuery["channels"][0]>["users"]>;

export const ChannelUsers: React.FC<{
  users: Users;
}> = (props) => {
  const { users = [] } = props;

  const onlines = useMemo(() => users?.filter((it) => it.user.sessionState === UserSessionState.Online), [users]);
  const offlines = useMemo(() => users.filter((it) => it.user.sessionState === UserSessionState.Offline), [users]);

  return (
    <div className="px-2">
      <UsersPannel title="在线" users={onlines} />
      <UsersPannel title="离线" users={offlines} />
    </div>
  );
};

const UsersPannel: React.FC<{ title: string; users: Users }> = ({ title, users }) => {
  return (
    <div className="mt-5 select-none">
      <div className="mb-2 pl-3 text-sm">
        {title} - {users.length}
      </div>
      {users.map((user) => (
        <UserPopover nickname={user.user.nickname} no={user.user.nicknameNo} key={user.user.id}>
          <div className="flex items-center rounded-md px-3 py-1.5 text-zinc-300 hover:bg-zinc-700">
            <img
              src={imgUrl(user.user.avatar, DEFAULT_AVATAR)}
              alt="avatar"
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="ml-2" style={{ color: user.role.color ?? undefined }}>
              {user.user.nickname}
            </div>
          </div>
        </UserPopover>
      ))}
    </div>
  );
};
