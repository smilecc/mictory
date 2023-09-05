import { gql } from "@/@generated";
import { socketClient } from "@/contexts";
import { useChannelStore, useCommonStore } from "@/stores";
import { NoticeErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import { Card, MantineProvider, TextInput, Title, Text, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const USER_LOGIN = gql(`mutation userLogin($args: UserSessionCreateInput!) {
  userSessionCreate(args: $args) {
    userId
    sessionToken
  }
}`);

export const LoginPage: React.FC = () => {
  const commonStore = useCommonStore();
  const channelStore = useChannelStore();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      account: "",
      password: "",
    },
  });

  const [mutationUserLogin, { loading: submitting }] = useMutation(USER_LOGIN);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-surface2">
      <MantineProvider theme={{ colorScheme: "light" }}>
        <Card shadow="sm" radius="md" withBorder className="w-96 select-none">
          <Title order={2} className="mb-1">
            登录到
          </Title>

          <Text className="mb-4">Mictory</Text>
          <form
            onSubmit={form.handleSubmit((value) => {
              mutationUserLogin({
                variables: {
                  args: { ...value },
                },
              })
                .then(({ data }) => {
                  commonStore.sessionToken = data!.userSessionCreate.sessionToken;
                  console.log(data?.userSessionCreate);
                  socketClient.close();
                  channelStore.cleanUserState();
                  navigate("/channel", { replace: true });

                  notifications.show({
                    message: "登录成功",
                    color: "green",
                    icon: <IconCheck />,
                  });
                })
                .catch(NoticeErrorHandler);
            })}
          >
            <TextInput label="账号" placeholder="请输入账号" required {...form.register("account")} />
            <TextInput
              className="mt-4"
              label="密码"
              placeholder="请输入密码"
              type="password"
              required
              {...form.register("password")}
            />
            <Button className="mt-4" fullWidth type="submit" loading={submitting}>
              登录
            </Button>
            <Button
              className="mt-2"
              variant="outline"
              fullWidth
              loading={submitting}
              onClick={() => {
                navigate("/user/create");
              }}
            >
              去注册一个账户
            </Button>
          </form>
        </Card>
      </MantineProvider>
    </div>
  );
};
