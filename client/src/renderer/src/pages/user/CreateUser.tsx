import { Button, Card, MantineProvider, TextInput, Title, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { UserApi } from "@renderer/api";
import { useCommonStore } from "@renderer/stores";
import { NoticeErrorHandler } from "@renderer/utils";
import { IconCheck } from "@tabler/icons-react";
import { useReactive } from "ahooks";
import { Observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";

export const UserCreatePage: React.FC = () => {
  const commonStore = useCommonStore();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: "",
      nickname: "",
      password: "",
    },
  });

  const state = useReactive({
    submitting: false,
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <MantineProvider theme={{ colorScheme: "light" }}>
        <Card shadow="sm" radius="md" withBorder className="w-96 select-none">
          <Title order={2} className="mb-1">
            注册到
          </Title>

          <Observer>{() => <Text className="mb-4">{commonStore.currentConnectServer?.url}</Text>}</Observer>
          <form
            onSubmit={form.onSubmit((value) => {
              state.submitting = true;
              UserApi.createUser(value.email, value.nickname, value.password)
                .then(({ data }) => {
                  commonStore.setAccessToken(data.data.accessToken);
                  return commonStore.loadUserInfo();
                })
                .then(() => {
                  navigate("/");
                  showNotification({
                    message: "用户注册成功",
                    color: "green",
                    icon: <IconCheck />,
                  });
                })
                .catch(NoticeErrorHandler)
                .finally(() => {
                  state.submitting = false;
                });
            })}
          >
            <TextInput label="邮箱" placeholder="请输入邮箱" required {...form.getInputProps("email")} />
            <TextInput className="mt-4" label="昵称" placeholder="请输入昵称" required {...form.getInputProps("nickname")} />
            <TextInput className="mt-4" label="密码" placeholder="请输入密码" type="password" required {...form.getInputProps("password")} />
            <Button className="mt-4" fullWidth type="submit" loading={state.submitting}>
              注册
            </Button>
            <Button
              className="mt-2"
              variant="outline"
              fullWidth
              loading={state.submitting}
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
