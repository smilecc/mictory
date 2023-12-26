import { gql } from "@/@generated";
import { useMutation } from "@apollo/client";
import { Button, Modal, ModalProps, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";

const CREATE_ROOM_MUTATION =
  gql(`mutation createChannelRoom($where: ChannelWhereUniqueInput!, $data: ChannelUpdateInput!) {
  channelUpdate (where: $where, data: $data) {
    id
  }
}`);

export const CreateRoomModal: React.FC<
  { channelId: number; categories: { id: number; name: string }[]; onOk?: () => void } & ModalProps
> = (props) => {
  const { channelId, categories, onOk, ...otherProps } = props;
  const form = useForm({
    initialValues: {
      name: "",
      categoryId: "",
    },
  });

  const [mutationCreateRoom, { loading: submitting }] = useMutation(CREATE_ROOM_MUTATION);

  return (
    <Modal title="创建房间" closeOnClickOutside={false} {...otherProps} centered>
      <form
        onSubmit={form.onSubmit((data) => {
          mutationCreateRoom({
            variables: {
              where: { id: channelId },
              data: {
                rooms: {
                  create: [
                    {
                      name: data.name,
                      channelCategory: {
                        connect: { id: data.categoryId },
                      },
                    },
                  ],
                },
              },
            },
          }).then(() => {
            notifications.show({
              color: "green",
              title: "房间创建成功",
              message: "^ᴗ^",
            });
            onOk?.();
          });
        })}
      >
        <Select
          required
          mb="md"
          label="频道分组"
          placeholder="请选择频道分组"
          searchable
          data={categories.map((it) => ({
            label: it.name,
            value: `${it.id}`,
          }))}
          {...form.getInputProps("categoryId")}
          classNames={{
            input: "mt-2",
          }}
        />
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
            创建房间
          </Button>
        </div>
      </form>
    </Modal>
  );
};
