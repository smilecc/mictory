import { Button, Card, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { UserApi } from "@renderer/api";
import { useCommonStore } from "@renderer/stores";
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

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Card shadow="sm" radius="md" withBorder className=" w-96">
        <form
          onSubmit={form.onSubmit((value) => {
            UserApi.login(value.account, value.password).then(({ data }) => {
              commonStore.setAccessToken(data.data.accessToken);
              navigate("/");
            });
          })}
        >
          <TextInput
            label="账号"
            placeholder="请输入账号"
            required
            {...form.getInputProps("account")}
          />
          <TextInput
            className="mt-4"
            label="密码"
            placeholder="请输入密码"
            type="password"
            required
            {...form.getInputProps("password")}
          />
          <Button className="mt-4" fullWidth type="submit">
            登录
          </Button>
        </form>
      </Card>
    </div>
  );
};
