import { Room } from "@/@generated/graphql";
import { UPDATE_ROOM } from "@/queries";
import { useMutation } from "@apollo/client";
import { Button, Modal, ModalProps, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useReactive } from "ahooks";
import React, { useEffect } from "react";

export type UpdateRoomModalRoom = Pick<Room, "id" | "name">;

export const UpdateRoomModal: React.FC<{ room?: UpdateRoomModalRoom; onOk?: () => void } & ModalProps> = (props) => {
  const { room, onOk, ...otherProps } = props;
  const state = useReactive({
    lastId: 0,
  });

  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (props.opened && room?.id !== state.lastId) {
      state.lastId = room?.id;
      form.setValues({
        name: room?.name,
      });
    }
  }, [form, props.opened, room?.id, room?.name, state, state.lastId]);

  const [updateRoom, { loading: submitting }] = useMutation(UPDATE_ROOM);

  return (
    <Modal title="编辑房间" closeOnClickOutside={false} {...otherProps} centered>
      <form
        onSubmit={form.onSubmit((data) => {
          updateRoom({
            variables: {
              id: room?.id,
              data: {
                name: {
                  set: data.name,
                },
              },
            },
          }).then(() => {
            notifications.show({
              color: "green",
              title: "房间编辑成功",
              message: "^ᴗ^",
            });
            onOk?.();
          });
        })}
      >
        <TextInput
          mb="md"
          label="房间名"
          placeholder="请输入房间名"
          required
          {...form.getInputProps("name")}
          classNames={{
            input: "mt-2",
          }}
        />

        <div className="flex justify-end pt-1">
          <Button loading={submitting} type="submit">
            确认编辑
          </Button>
        </div>
      </form>
    </Modal>
  );
};
