import { gql } from "@/@generated";
import { useMutation } from "@apollo/client";
import { Button, Modal, ModalProps, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";

const CREATE_CHANNEL_CATEGORY_MUTATION =
  gql(`mutation createChannelRoom($where: ChannelWhereUniqueInput!, $data: ChannelUpdateInput!) {
  channelUpdate (where: $where, data: $data) {
    id
  }
}`);

export const CreateChannelCategoryModal: React.FC<{ channelId: number; onOk?: () => void } & ModalProps> = (props) => {
  const { channelId, onOk, ...otherProps } = props;
  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  const [mutationCreateCategory, { loading: submitting }] = useMutation(CREATE_CHANNEL_CATEGORY_MUTATION);

  return (
    <Modal title="创建分组" closeOnClickOutside={false} {...otherProps}>
      <form
        onSubmit={form.onSubmit((data) => {
          mutationCreateCategory({
            variables: {
              where: { id: channelId },
              data: {
                categories: {
                  create: [
                    {
                      name: data.name,
                    },
                  ],
                },
              },
            },
          }).then(() => {
            notifications.show({
              color: "green",
              title: "分组创建成功",
              message: "^ᴗ^",
            });
            onOk?.();
          });
        })}
      >
        <TextInput mb="md" label="分组名" placeholder="请输入分组名" required {...form.getInputProps("name")} />

        <div className="flex justify-end pt-1">
          <Button loading={submitting} type="submit">
            创建分组
          </Button>
        </div>
      </form>
    </Modal>
  );
};
