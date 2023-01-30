import { Button, Group, Modal, ModalProps, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { ServerApi } from "@renderer/api";
import { NoticeErrorHandler } from "@renderer/utils";
import { IconCheck } from "@tabler/icons-react";
import { useReactive } from "ahooks";
import React, { useEffect } from "react";

export const CreateServerModal: React.FC<
  ModalProps & {
    onCreated: (serverId: number) => void;
  }
> = (props) => {
  const state = useReactive({
    loading: false,
  });
  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (props.opened) {
      form.reset();
    }
  }, [props.opened]);

  return (
    <Modal {...props} title="创建频道">
      <form
        onSubmit={form.onSubmit((value) => {
          state.loading = true;
          ServerApi.createServer(value.name)
            .then(({ data }) => {
              showNotification({
                message: "频道创建成功",
                color: "green",
                icon: <IconCheck />,
              });
              props.onCreated(data.data.serverId);
            })
            .catch(NoticeErrorHandler)
            .finally(() => {
              state.loading = false;
            });
        })}
      >
        <TextInput label="频道名称" placeholder="请输入频道名称" required {...form.getInputProps("name")} />
        <Group position="right" mt="md">
          <Button type="submit" loading={state.loading}>
            立即创建
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
