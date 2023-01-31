import { Button, Group, Modal, ModalProps, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { RoomApi } from "@renderer/api";
import { NoticeErrorHandler } from "@renderer/utils";
import { IconCheck } from "@tabler/icons-react";
import { useReactive } from "ahooks";
import React, { useEffect } from "react";

export const CreateRoomModal: React.FC<
  ModalProps & {
    serverId: number;
    onSuccess: (serverId: string) => void;
  }
> = (props) => {
  const state = useReactive({
    loading: false,
  });
  const form = useForm({
    initialValues: {
      roomName: "",
    },
  });

  useEffect(() => {
    if (props.opened) {
      form.reset();
    }
  }, [props.opened]);

  return (
    <Modal {...props} title="创建房间" centered>
      <form
        onSubmit={form.onSubmit((value) => {
          state.loading = true;
          RoomApi.createRoom(props.serverId, value.roomName)
            .then(() => {
              showNotification({
                message: "创建房间成功",
                color: "green",
                icon: <IconCheck />,
              });
              props.onSuccess(value.roomName);
            })
            .catch(NoticeErrorHandler)
            .finally(() => {
              state.loading = false;
            });
        })}
      >
        <TextInput label="房间名" placeholder="请输入房间名称" required {...form.getInputProps("roomName")} />
        <Group position="right" mt="md">
          <Button type="submit" loading={state.loading}>
            创建
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
