import { JoinChannelModal, SettingModal, SideAvatar } from "@/components/business";
import React, { Fragment, useContext, useEffect } from "react";
// import { useLoaderData } from "react-router-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { gql } from "@/@generated";
import { SocketClientContext } from "@/contexts";
import { Divider, Loader, Transition } from "@mantine/core";
import { IconMessage2Heart, IconPlus } from "@tabler/icons-react";
import { useChannelStore } from "@/stores";
import { Observer } from "mobx-react-lite";
import { autorun, runInAction } from "mobx";
import { RouteGuard } from "@/routes";
import { useReactive } from "ahooks";
import { NewChatMessageEvent } from "@mictory/common";
import { notifications } from "@mantine/notifications";
import { truncate } from "lodash-es";

const QUERY_USER_CHANNELS = gql(`
query listUserChannel {
  user(where: { nicknameNo: { equals: -1 } }) {
    id
    nickname
    nicknameNo
    channels {
      channel {
        id
        name
        code
        avatar
        ownerUser {
          ...UserFrag
        }
      }
    }
  }
}

fragment UserFrag on User {
  id
  nickname
  nicknameNo
  sessionState
  avatar
}
`);

export const BaseLayout: React.FC<React.PropsWithChildren> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const channelStore = useChannelStore();
  const params = useParams<{ channelCode: string }>();
  const socketClient = useContext(SocketClientContext);

  const state = useReactive({
    openJoinChannelModal: false,
  });

  const {
    data,
    loading: userChannelLoading,
    refetch: refetchUserChannel,
  } = useQuery(QUERY_USER_CHANNELS, {
    pollInterval: 90 * 1000,
  });

  useEffect(
    () =>
      autorun(() => {
        if (channelStore.firstLoading) {
          refetchUserChannel();
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    runInAction(() => {
      if (!userChannelLoading && channelStore.firstLoading) {
        channelStore.firstLoading = false;
      }

      channelStore.userWithChannels = data?.user;
    });
  }, [channelStore, data?.user, userChannelLoading]);

  useEffect(() => {
    if (!socketClient.connected) {
      console.log("socketClient.connect()");
      socketClient.connect();
    }
  }, [channelStore, socketClient]);

  useEffect(() => {
    socketClient.on("newChatMessage", async (event: NewChatMessageEvent) => {
      if (event.target === "USER") {
        notifications.show({
          color: "teal",
          title: (
            <span>
              <span className="mr-1">新消息来自</span>
              <span className="font-bold">{event.fromUser.nickname}</span>
            </span>
          ),
          message: truncate(event.text, { length: 26 }),
        });
      }
    });

    return () => {
      console.log('BaseLayout -> socketClient.off("newChatMessage")');
      socketClient.off("newChatMessage");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RouteGuard>
      <div className="relative h-screen w-screen">
        {/* 加载覆盖层 */}
        <Observer>
          {() => (
            <Transition mounted={channelStore.firstLoading} transition="fade" duration={200} timingFunction="ease">
              {(styles) => (
                <div
                  style={styles}
                  className="absolute inset-x-0 inset-y-0 z-50 flex items-center justify-center bg-surface1"
                >
                  <Loader variant="dots" size="xl" />
                </div>
              )}
            </Transition>
          )}
        </Observer>

        <SettingModal />
        <JoinChannelModal
          opened={state.openJoinChannelModal}
          onClose={() => {
            refetchUserChannel();
            state.openJoinChannelModal = false;
          }}
        />

        <main className="h-screen">
          <div className="flex h-full">
            {/* 侧边栏 */}
            <div className="box-border h-full overflow-y-auto bg-background pr-2 pt-2">
              <SideAvatar
                name="信息"
                active={location.pathname === "/channel/@msg"}
                icon={<IconMessage2Heart />}
                onClick={() => navigate("/channel/@msg")}
              />
              <div className="mb-2 flex justify-center pl-2">
                <Divider size="sm" className="w-8" />
              </div>
              <SideAvatar name="添加频道" icon={<IconPlus />} onClick={() => (state.openJoinChannelModal = true)} />

              <Observer>
                {() => (
                  <>
                    {data?.user?.channels?.map((it) => (
                      <Fragment key={it.channel.id}>
                        <SideAvatar
                          avatar={it.channel.avatar}
                          name={it.channel.name}
                          key={it.channel.id}
                          active={it.channel.code === params.channelCode}
                          onClick={() => {
                            navigate(`/channel/${it.channel.code}`);
                          }}
                        />
                      </Fragment>
                    ))}
                  </>
                )}
              </Observer>
            </div>

            {props.children}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};
