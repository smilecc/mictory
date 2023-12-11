import { gql } from "@/@generated";
import { NoticeErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import { Button, Input, Modal, ModalProps, Radio } from "@mantine/core";
import { useReactive } from "ahooks";
import React, { useCallback } from "react";
import { notifications } from "@mantine/notifications";

const JOIN = gql(`mutation joinChannel ($code: String!) {
  channelJoin(data: { code: $code }) {
    id
  }
}`);

const CREATE = gql(`mutation createChannel($data: ChannelCreateInput!) {
  channelCreate(data: $data) {
    id
  }
}`);

export const JoinChannelModal: React.FC<ModalProps> = (props) => {
  const [join, { loading: joinLoading }] = useMutation(JOIN);
  const [create, { loading: createLoading }] = useMutation(CREATE);

  const state = useReactive({
    step: 0,
    type: "join",
    channelCode: "",
    channelName: "",
  });

  const onClose = useCallback(() => {
    setTimeout(() => {
      state.step = 0;
      state.type = "join";
      state.channelCode = "";
      state.channelName = "";
    }, 500);
    props.onClose();
  }, [props, state]);

  const onSubmit = useCallback(async () => {
    if (state.type === "join") {
      await join({
        variables: {
          code: state.channelCode,
        },
      })
        .then(() => {
          onClose();
          notifications.show({
            color: "green",
            title: "成功",
            message: "加入频道成功~",
          });
        })
        .catch(NoticeErrorHandler);
    } else {
      await create({
        variables: {
          data: {
            name: state.channelName,
          },
        },
      })
        .then(() => {
          onClose();
          notifications.show({
            color: "green",
            title: "成功",
            message: "创建频道成功~",
          });
        })
        .catch(NoticeErrorHandler);
    }
  }, [create, join, onClose, state.channelCode, state.channelName, state.type]);

  return (
    <Modal {...props} title="添加频道" centered onClose={onClose}>
      {state.step === 0 && (
        <Radio.Group name="type" className="mt-2" value={state.type} onChange={(e) => (state.type = e)}>
          <Radio label="加入频道" description="我有频道链接，想加入别人的频道" value="join" />
          <Radio label="创建频道" description="我想创建一个频道" value="create" className="mt-4" />
        </Radio.Group>
      )}

      {state.step === 1 && state.type === "join" && (
        <>
          <Input.Wrapper label="频道邀请链接" description="请输入频道ID或频道邀请链接">
            <Input
              className="mt-2"
              placeholder="请输入"
              value={state.channelCode}
              onChange={(e) => (state.channelCode = e.target.value)}
            />
          </Input.Wrapper>
        </>
      )}

      {state.step === 1 && state.type === "create" && (
        <>
          <Input.Wrapper label="频道名称">
            <Input
              className="mt-2"
              placeholder="请输入频道名称"
              value={state.channelName}
              onChange={(e) => (state.channelName = e.target.value)}
            />
          </Input.Wrapper>
        </>
      )}

      <div className="mt-4 flex justify-end">
        {state.step === 0 && <Button onClick={() => (state.step += 1)}>下一步</Button>}

        {state.step === 1 && (
          <Button type="submit" onClick={onSubmit} loading={joinLoading || createLoading}>
            确认
          </Button>
        )}
      </div>
    </Modal>
  );
};
