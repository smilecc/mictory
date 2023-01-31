import { Avatar, Group, HoverCard, LoadingOverlay, UnstyledButton, Text } from "@mantine/core";
import { IUserInfo, UserApi } from "@renderer/api";
import { NoticeErrorHandler } from "@renderer/utils";
import { useReactive } from "ahooks";
import React, { useState } from "react";

export const UserPopover: React.FC<{
  children: React.ReactNode;
  userId: number;
}> = (props) => {
  const state = useReactive({
    loading: false,
  });
  const [user, setUser] = useState<IUserInfo | null>(null);

  return (
    <HoverCard
      withArrow
      arrowOffset={20}
      position="bottom-start"
      radius="md"
      openDelay={100}
      onOpen={() => {
        state.loading = true;
        UserApi.getUserInfo(props.userId)
          .then(({ data }) => {
            setUser(data.data);
          })
          .catch(NoticeErrorHandler)
          .finally(() => {
            state.loading = false;
          });
      }}
    >
      <HoverCard.Target>{props.children}</HoverCard.Target>
      <HoverCard.Dropdown>
        <LoadingOverlay visible={state.loading} overlayBlur={2} />
        {user && (
          <UnstyledButton>
            <Group>
              <Avatar size={40} color="blue">
                {user.nickname?.[0]?.toUpperCase()}
              </Avatar>
              <div>
                <Text>{user.nickname}</Text>
                <Text size="xs" color="dimmed">
                  {user.nickname}#{user.nicknameNo}
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        )}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
