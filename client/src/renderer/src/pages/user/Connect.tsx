import { Button, Card, MantineProvider, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { ServerApi } from "@renderer/api";
import { useCommonStore } from "@renderer/stores";
import { IConnectServer } from "@renderer/stores/CommonStore";
import { NoticeErrorHandler } from "@renderer/utils";
import { useReactive } from "ahooks";
import React from "react";
import { useNavigate } from "react-router-dom";

export const UserConnectPage: React.FC = () => {
  const commonStore = useCommonStore();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      url: "",
    },
  });

  const state = useReactive({
    submitting: false,
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <MantineProvider theme={{ colorScheme: "light" }}>
        <Card shadow="sm" radius="md" withBorder className=" w-96">
          <Title order={2} className="mb-4">
            连接到服务器
          </Title>
          <form
            onSubmit={form.onSubmit((value) => {
              const url = new URL(value.url);
              state.submitting = true;
              ServerApi.getServerVersion(value.url)
                .then(({ data }) => {
                  const server: IConnectServer = {
                    url: value.url,
                    host: url.host,
                    isHttps: url.protocol.startsWith("https"),
                    version: data.data.version,
                    accessToken: null,
                    active: true,
                  };
                  commonStore.addConnectServer(server);
                  commonStore.activeConnectServer(server);
                  showNotification({
                    title: "连接服务器成功",
                    message: "服务器版本: " + server.version,
                    color: "green",
                  });
                  navigate("/user/login");
                })
                .catch(NoticeErrorHandler)
                .finally(() => {
                  state.submitting = false;
                });
            })}
          >
            <TextInput label="服务器地址" placeholder="请输入服务器地址" required {...form.getInputProps("url")} />
            <Button className="mt-4" fullWidth type="submit" loading={state.submitting}>
              连接服务器
            </Button>
            {commonStore.connectServers.length > 0 && (
              <Button
                className="mt-2"
                variant="outline"
                fullWidth
                loading={state.submitting}
                onClick={() => {
                  navigate("/");
                }}
              >
                返回主页
              </Button>
            )}
          </form>
        </Card>
      </MantineProvider>
    </div>
  );
};
