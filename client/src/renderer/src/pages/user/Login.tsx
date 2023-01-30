import { Button, Card, MantineProvider, TextInput, Title, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { UserApi } from "@renderer/api";
import { useCommonStore } from "@renderer/stores";
import { NoticeErrorHandler } from "@renderer/utils";
import { useReactive } from "ahooks";
import { Observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";

export const UserLoginPage: React.FC = () => {
  const commonStore = useCommonStore();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      account: "",
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
            登录到
          </Title>

          <Observer>{() => <Text className="mb-4">{commonStore.currentConnectServer?.url}</Text>}</Observer>
          <form
            onSubmit={form.onSubmit((value) => {
              state.submitting = true;
              UserApi.login(value.account, value.password)
                .then(({ data }) => {
                  commonStore.setAccessToken(data.data.accessToken);
                  return commonStore.loadUserInfo();
                })
                .then(() => {
                  navigate("/");
                })
                .catch(NoticeErrorHandler)
                .finally(() => {
                  state.submitting = false;
                });
            })}
          >
            <TextInput label="账号" placeholder="请输入账号" required {...form.getInputProps("account")} />
            <TextInput className="mt-4" label="密码" placeholder="请输入密码" type="password" required {...form.getInputProps("password")} />
            <Button className="mt-4" fullWidth type="submit" loading={state.submitting}>
              登录
            </Button>
          </form>
        </Card>
      </MantineProvider>
    </div>
  );
};
