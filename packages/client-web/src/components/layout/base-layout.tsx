import { SideAvatar } from "@/components/business";
import React, { Fragment, useContext, useEffect } from "react";
// import { useLoaderData } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { gql } from "@/@generated";
import { SocketClientContext } from "@/contexts";
import { Divider, Loader, Transition } from "@mantine/core";
import { IconMessage2Heart, IconPlus } from "@tabler/icons-react";
import { useChannelStore } from "@/stores";
import { Observer } from "mobx-react-lite";
import { autorun, runInAction } from "mobx";
import { RouteGuard } from "@/routes";

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
  const channelStore = useChannelStore();
  const params = useParams<{ channelCode: string }>();
  const socketClient = useContext(SocketClientContext);
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

        <main className="h-screen">
          <div className="flex h-full">
            {/* 侧边栏 */}
            <div className="bg-background pr-2 pt-2">
              <SideAvatar name="信息" icon={<IconMessage2Heart />} onClick={() => navigate("/channel/@msg")} />
              <div className="mb-2 flex justify-center pl-2">
                <Divider size="sm" className="w-8" />
              </div>
              <SideAvatar name="增加频道" icon={<IconPlus />} />

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
