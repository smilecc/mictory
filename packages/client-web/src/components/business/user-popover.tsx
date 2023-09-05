import { gql } from "@/@generated";
import { UserSessionState } from "@/@generated/graphql";
import { useLazyQuery } from "@apollo/client";
import { Avatar, Group, HoverCard, LoadingOverlay, UnstyledButton, Text } from "@mantine/core";
// import { IUserInfo, UserApi } from "@renderer/api";
// import { NoticeErrorHandler } from "@renderer/utils";
import React from "react";

const QUERY_USER_POPOVER = gql(`query getUserPopoverInfo($nickname: String!, $no: Int!) {
  user(where: { nickname: { equals: $nickname }, nicknameNo: { equals: $no } }) {
    id
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
    <HoverCard
      withArrow
      arrowOffset={20}
      position="bottom-start"
      radius="md"
      openDelay={100}
      onOpen={() => {
        getUserInfo({
          variables: {
            nickname: props.nickname,
            no: props.no,
          },
        });
      }}
    >
      <HoverCard.Target>{props.children}</HoverCard.Target>
      <HoverCard.Dropdown>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        {user && (
          <UnstyledButton>
            <Group>
              <Avatar size={40} color="blue">
                {user.user?.nickname?.[0]?.toUpperCase()}
              </Avatar>
              <div>
                <Text>
                  {user.user?.nickname}#{user.user?.nicknameNo}
                </Text>
                <Text size="xs" color="dimmed">
                  {user.user?.sessionState === UserSessionState.Online ? "在线" : "离线"}
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        )}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default UserPopover;
