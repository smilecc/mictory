import { gql } from "@/@generated";
import { useMutation } from "@apollo/client";
import { Button, Modal, ModalProps, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

const CREATE_ROOM_MUTATION =
  gql(`mutation createChannelRoom($where: ChannelWhereUniqueInput!, $data: ChannelUpdateInput!) {
  channelUpdate (where: $where, data: $data) {
    id
  }
}`);

export const CreateRoomModal: React.FC<
  { categories: { id: number; name: string }[]; onOk?: () => void } & ModalProps
> = (props) => {
  const { categories, onOk, ...otherProps } = props;
  const form = useForm({
    initialValues: {
      name: "",
      categoryId: "",
    },
  });

  const [mutationCreateRoom, { loading: submitting }] = useMutation(CREATE_ROOM_MUTATION);

  return (
    <Modal title="创建房间" closeOnClickOutside={false} {...otherProps}>
      <form
        onSubmit={form.onSubmit((data) => {
          mutationCreateRoom({
            variables: {
              where: { id: 1 },
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
        />
        <TextInput mb="md" label="房间名" placeholder="请输入房间名" required {...form.getInputProps("name")} />

        <div className="flex justify-end pt-1">
          <Button loading={submitting} type="submit">
            创建房间
          </Button>
        </div>
      </form>
    </Modal>
  );
};
