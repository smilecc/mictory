import { useCommonStore } from "@/stores";
import { Button, Card, MantineProvider, TextInput, Title, Text } from "@mantine/core";
import { useReactive } from "ahooks";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const UserCreatePage: React.FC = () => {
  const commonStore = useCommonStore();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
    },
  });

  const state = useReactive({
    submitting: false,
  });

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
              state.submitting = true;
              // UserApi.createUser(value.email, value.nickname, value.password)
              //   .then(({ data }) => {
              //     commonStore.setAccessToken(data.data.accessToken);
              //     return commonStore.loadUserInfo();
              //   })
              //   .then(() => {
              //     navigate("/");
              //     showNotification({
              //       message: "用户注册成功",
              //       color: "green",
              //       icon: <IconCheck />,
              //     });
              //   })
              //   .catch(NoticeErrorHandler)
              //   .finally(() => {
              //     state.submitting = false;
              //   });
            })}
          >
            <TextInput label="邮箱" placeholder="请输入邮箱" required {...form.register("email")} />
            <TextInput className="mt-4" label="昵称" placeholder="请输入昵称" required {...form.register("nickname")} />
            <TextInput
              className="mt-4"
              label="密码"
              placeholder="请输入密码"
              type="password"
              required
              {...form.register("password")}
            />
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
