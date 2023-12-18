import { gql } from "@/@generated";
import { GetUserPopoverInfoQuery, UserSessionState, UserType } from "@/@generated/graphql";
import { DEFAULT_AVATAR, DEFAULT_USER_BG } from "@/utils";
import { useLazyQuery } from "@apollo/client";
import { Text, Skeleton, Card, Image, Button, Badge, Popover } from "@mantine/core";
// import { IUserInfo, UserApi } from "@renderer/api";
// import { NoticeErrorHandler } from "@renderer/utils";
import React from "react";

const QUERY_USER_POPOVER = gql(`query getUserPopoverInfo($nickname: String!, $no: Int!) {
  user(where: { nickname: { equals: $nickname }, nicknameNo: { equals: $no } }) {
    id
    type
    nickname
    nicknameNo
    avatar
    sessionState
  }
}`);

export const UserPopover: React.FC<{
  children: React.ReactNode;
  nickname: string;
  no: number;
}> = (props) => {
  const [getUserInfo, { data: user, loading }] = useLazyQuery(QUERY_USER_POPOVER);

  return (
    <Popover
      arrowOffset={20}
      position="left"
      radius="md"
      onOpen={() => {
        getUserInfo({
          variables: {
            nickname: props.nickname,
            no: props.no,
          },
        });
      }}
    >
      <Popover.Target>{props.children}</Popover.Target>
      <Popover.Dropdown className="border-0 p-0" my="sm">
        {loading && (
          <div className="flex">
            <Skeleton height={50} width={50} circle />
            <div className="ml-2 flex flex-col justify-center">
              <Skeleton height={10} width={80} radius="xl" mb="xs" />
              <Skeleton height={8} width={50} radius="xl" />
            </div>
          </div>
        )}
        {user && <UserPopoverCard user={user.user} />}
      </Popover.Dropdown>
    </Popover>
  );
};

export const UserPopoverCard: React.FC<{ user: GetUserPopoverInfoQuery["user"] }> = ({ user }) => {
  return (
    <Card shadow="lg" padding="lg" radius="md" className="w-96">
      <Card.Section>
        <Image src={DEFAULT_USER_BG} height={80} alt="Norway" />
      </Card.Section>

      <div className="relative flex justify-between">
        <div className="absolute -left-1 -top-8 rounded-full bg-gray-700 p-1">
          <img className="h-16 w-16 rounded-full object-cover" alt="avatar" src={user?.avatar || DEFAULT_AVATAR} />
        </div>
        <div />
        <div className="pt-2">
          <Button size="xs" color="gray" compact>
            发私信
          </Button>
        </div>
      </div>

      <div>
        <div className="relative mb-2 mt-7">
          <div className="flex items-center">
            <Text fw={500} className="mr-1 leading-none text-white" size="lg">
              {user?.nickname}#{user?.nicknameNo}
            </Text>
            {user?.sessionState === UserSessionState.Online ? (
              <Badge color="green" className="mr-1">
                在线
              </Badge>
            ) : null}
            {user?.sessionState === UserSessionState.Offline ? (
              <Badge color="cyan" className="mr-1">
                离线
              </Badge>
            ) : null}

            {user?.type === UserType.Admin ? (
              <Badge color="blue" className="mr-1">
                管理员
              </Badge>
            ) : null}
          </div>
        </div>

        <Text size="sm" c="dimmed">
          什么也没留下...
        </Text>
      </div>
    </Card>
  );
};

export default UserPopover;
