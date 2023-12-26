import { gql } from "@/@generated";
import { Button, Card, Input, LoadingOverlay, TextInput, Title } from "@mantine/core";
import React, { useCallback } from "react";
import { UserPopoverCard } from "..";
import { useMutation, useQuery } from "@apollo/client";
import { ApiAxiosUpload, NoticeErrorHandler } from "@/utils";
import { modals } from "@mantine/modals";
import { useReactive } from "ahooks";
import { notifications } from "@mantine/notifications";

const FETCH_USER = gql(`query fetchCurrentUserForUpdate {
  user(where: { nicknameNo: { equals: -1 } }) {
    id
    type
    nickname
    nicknameNo
    avatar
    sessionState
    intro
    profileBanner
  }
}`);

const UPDATE_PROFILE = gql(`mutation updateUserProfile($data: UserProfileUpdateInput!) {
  userProfileUpdate(data: $data) {
    id
  }
}`);

const UPDATE_NICKNAME = gql(`mutation updateUserNickname($nickname: String!) {
  userNicknameUpdate(nickname: $nickname) {
    id
  }
}`);

const SettingUserProfile: React.FC = () => {
  const { data: user, refetch: refetchUser, loading } = useQuery(FETCH_USER);
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [updateNickname, { loading: updateNicknameLoading }] = useMutation(UPDATE_NICKNAME);
  const state = useReactive({
    editInput: "",
  });

  const onEditNicknameClick = useCallback(() => {
    modals.open({
      title: "修改昵称",
      centered: true,
      onClose() {
        state.editInput = "";
      },
      children: (
        <>
          <TextInput
            classNames={{ input: "mt-1" }}
            label="新昵称"
            placeholder="请输入新昵称"
            data-autofocus
            onChange={(e) => (state.editInput = e.target.value)}
          />
          <Button
            fullWidth
            onClick={() => {
              updateNickname({
                variables: {
                  nickname: state.editInput,
                },
              })
                .then(() => {
                  notifications.show({
                    color: "green",
                    title: "昵称修改成功",
                    message: "^ᴗ^",
                  });
                  modals.closeAll();
                })
                .catch(NoticeErrorHandler)
                .finally(refetchUser);
            }}
            mt="md"
            loading={updateNicknameLoading}
          >
            确认修改
          </Button>
        </>
      ),
    });
  }, [refetchUser, state, updateNickname, updateNicknameLoading]);

  const onEditIntroClick = useCallback(() => {
    modals.open({
      title: "修改简介",
      centered: true,
      onClose() {
        state.editInput = "";
      },
      children: (
        <>
          <TextInput
            classNames={{ input: "mt-1" }}
            label="个人简介"
            placeholder="请输入个人简介"
            data-autofocus
            onChange={(e) => (state.editInput = e.target.value)}
            max={150}
          />
          <Button
            fullWidth
            onClick={() => {
              updateProfile({
                variables: {
                  data: {
                    intro: state.editInput,
                  },
                },
              })
                .then(() => {
                  notifications.show({
                    color: "green",
                    title: "个人简介修改成功",
                    message: "^ᴗ^",
                  });
                  modals.closeAll();
                })
                .catch(NoticeErrorHandler)
                .finally(refetchUser);
            }}
            mt="md"
            loading={updateNicknameLoading}
          >
            确认修改
          </Button>
        </>
      ),
    });
  }, [refetchUser, state, updateNicknameLoading, updateProfile]);

  return (
    <div className="relative h-full w-full">
      <LoadingOverlay visible={loading} />
      <Title order={2} className="text-white">
        用户资料
      </Title>
      <div>
        <Title order={5} className="my-4 text-white">
          我的卡片
        </Title>

        <UserPopoverCard
          user={user?.user}
          edit
          onUpload={(field, file) => {
            if (file) {
              ApiAxiosUpload(file)
                .then(({ data }) => {
                  return updateProfile({
                    variables: {
                      data: {
                        [field]: data.name,
                      },
                    },
                  });
                })
                .finally(refetchUser);
            }
          }}
        />

        <Title order={5} className="my-4 text-white">
          我的资料
        </Title>

        <Card>
          <Input.Wrapper
            label={
              <>
                <span className="mr-2">昵称</span>
                <Button compact className="mt-2" size="xs" variant="light" color="green" onClick={onEditNicknameClick}>
                  修改昵称
                </Button>
              </>
            }
          >
            <div className="mt-1 text-base font-bold text-gray-100">
              {user?.user?.nickname}#{user?.user?.nicknameNo}
            </div>
          </Input.Wrapper>

          <Input.Wrapper
            label={
              <>
                <span className="mr-2">个人简介</span>
                <Button compact className="mt-2" size="xs" variant="light" color="green" onClick={onEditIntroClick}>
                  修改简介
                </Button>
              </>
            }
            className="mt-6"
          >
            <div className="mt-1 text-base text-zinc-400">{user?.user?.intro || "暂未填写"}</div>
          </Input.Wrapper>
        </Card>
      </div>
    </div>
  );
};

export default SettingUserProfile;
