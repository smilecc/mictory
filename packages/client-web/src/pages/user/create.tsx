import { gql } from "@/@generated";
import { getSocketClient } from "@/contexts";
import { useChannelStore, useCommonStore } from "@/stores";
import { NoticeErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import { Button, Card, MantineProvider, TextInput, Title, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const USER_CREATE = gql(`mutation userCreate($data: UserCreateInput!) {
  userCreate(data: $data) {
    userId
    sessionToken
  }
}`);

export const UserCreatePage: React.FC = () => {
  const channelStore = useChannelStore();
  const commonStore = useCommonStore();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: "",
      nickname: "",
      password: "",
    },
  });

  const [mutationUserCreate, { loading: submitting }] = useMutation(USER_CREATE);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-surface2">
      <MantineProvider theme={{ colorScheme: "light" }}>
        <Card shadow="sm" radius="md" withBorder className="w-96 select-none">
          <Title order={2} className="mb-1">
            注册到
          </Title>

          <Text className="mb-4">Mictory</Text>
          <form
            onSubmit={form.handleSubmit((value) => {
              mutationUserCreate({
                variables: {
                  data: { ...value },
                },
              })
                .then(({ data }) => {
                  commonStore.sessionToken = data!.userCreate.sessionToken;
                  console.log(data?.userCreate);
                  getSocketClient().close();
                  channelStore.cleanUserState();
                  navigate("/channel", { replace: true });

                  notifications.show({
                    message: "用户注册成功",
                    color: "green",
                    icon: <IconCheck />,
                  });
                })
                .catch(NoticeErrorHandler);
            })}
          >
            <TextInput
              label="用户名"
              placeholder="请输入用户名"
              minLength={3}
              required
              {...form.register("username")}
            />
            <TextInput
              className="mt-4"
              label="昵称"
              placeholder="请输入昵称"
              minLength={1}
              required
              {...form.register("nickname")}
            />
            <TextInput
              className="mt-4"
              label="密码"
              placeholder="请输入密码"
              type="password"
              required
              minLength={6}
              {...form.register("password")}
            />
            <Button className="mt-4" fullWidth type="submit" loading={submitting}>
              注册
            </Button>
            <Button
              className="mt-2"
              variant="outline"
              fullWidth
              loading={submitting}
              onClick={() => {
                navigate("/user/login");
              }}
            >
              返回登录
            </Button>
          </form>
        </Card>
      </MantineProvider>
    </div>
  );
};
