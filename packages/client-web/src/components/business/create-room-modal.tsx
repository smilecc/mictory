import { Button, Modal, ModalProps, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

export const CreateRoomModal: React.FC<ModalProps> = (props) => {
  const form = useForm({
    initialValues: {
      name: "",
      categoryId: "",
    },
  });

  return (
    <Modal title="创建房间" {...props}>
      <form onSubmit={form.onSubmit(() => {})}>
        <Select
          required
          mb="md"
          label="频道分组"
          data={[
            {
              label: "",
              value: "",
            },
          ]}
          {...form.getInputProps("categoryId")}
        />
        <TextInput mb="md" label="房间名" placeholder="请输入房间名" required {...form.getInputProps("name")} />

        <div className="flex justify-end pt-1">
          <Button>创建房间</Button>
        </div>
      </form>
    </Modal>
  );
};
