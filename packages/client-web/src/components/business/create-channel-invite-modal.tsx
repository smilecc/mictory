import { gql } from "@/@generated";
import { useMutation } from "@apollo/client";
import { Button, CopyButton, LoadingOverlay, Modal, ModalProps, TextInput } from "@mantine/core";
import React, { useEffect, useMemo } from "react";

const CREATE = gql(`mutation createChannelInvite($id: BigInt!) {
  channelCreateInvite (id: $id) {
    id
    code
  }
}`);

export const CreateChannelInviteModal: React.FC<{ channelId: number } & ModalProps> = (props) => {
  const { channelId, ...otherProps } = props;

  const [createLink, { data, loading }] = useMutation(CREATE);

  useEffect(() => {
    if (props.opened) {
      createLink({
        variables: {
          id: channelId,
        },
      });
    }
  }, [channelId, createLink, props.opened]);

  const link = useMemo(
    () => `${window.location.origin}/i/${data?.channelCreateInvite.code}`,
    [data?.channelCreateInvite.code],
  );

  return (
    <Modal title="邀请好友" closeOnClickOutside={false} {...otherProps} centered>
      <LoadingOverlay visible={loading} />
      <TextInput
        mb="md"
        label="邀请链接"
        required
        value={link}
        readOnly
        rightSection={
          <div className="absolute right-2">
            <CopyButton value={link}>
              {({ copied, copy }) => (
                <Button compact size="xs" color={copied ? "teal" : "blue"} onClick={copy} className="relative">
                  {copied ? "已复制" : "复制"}
                </Button>
              )}
            </CopyButton>
          </div>
        }
        classNames={{
          input: "mt-2",
        }}
      />

      <div className="flex justify-end pt-1">
        <Button variant="light" onClick={props.onClose}>
          关闭
        </Button>
      </div>
    </Modal>
  );
};
