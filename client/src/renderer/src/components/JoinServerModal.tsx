import { Button, Group, Modal, ModalProps, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { ServerApi } from "@renderer/api";
import { NoticeErrorHandler } from "@renderer/utils";
import { IconCheck } from "@tabler/icons-react";
import { useReactive } from "ahooks";
import React, { useEffect } from "react";

export const JoinServerModal: React.FC<
  ModalProps & {
    onJoined: (serverId: string) => void;
  }
> = (props) => {
  const state = useReactive({
    loading: false,
  });
  const form = useForm({
    initialValues: {
      serverId: "",
    },
  });

  useEffect(() => {
    if (props.opened) {
      form.reset();
    }
  }, [props.opened]);

  return (
    <Modal {...props} title="加入频道" centered>
      <form
        onSubmit={form.onSubmit((value) => {
          state.loading = true;
          ServerApi.joinServer(value.serverId)
            .then(() => {
              showNotification({
                message: "频道加入成功",
                color: "green",
                icon: <IconCheck />,
              });
              props.onJoined(value.serverId);
            })
            .catch(NoticeErrorHandler)
            .finally(() => {
              state.loading = false;
            });
        })}
      >
        <TextInput label="频道ID" placeholder="请输入频道ID" required {...form.getInputProps("serverId")} />
        <Group position="right" mt="md">
          <Button type="submit" loading={state.loading}>
            立即加入
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
