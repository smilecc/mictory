import { useCommonStore } from "@/stores";
import { ChannelContext } from "@/utils";
import { Loader, Modal, ModalProps, NavLink } from "@mantine/core";
import { runInAction } from "mobx";
import { Observer } from "mobx-react-lite";
import { Suspense, lazy, useContext } from "react";

const UserProfile = lazy(() => import("./settings/user-profile"));
const AppAudio = lazy(() => import("./settings/app-audio"));

type Settings = {
  key: string;
  title: string;
  items: {
    title: string;
    link: string;
  }[];
}[];

const SETTINGS: Settings = [
  {
    key: "channel",
    title: "频道设置",
    items: [
      {
        title: "概况",
        link: "channel/profile",
      },
      {
        title: "房间管理",
        link: "channel/room",
      },
    ],
  },
  {
    key: "member",
    title: "用户管理",
    items: [
      {
        title: "角色",
        link: "member/role",
      },
      {
        title: "成员管理",
        link: "member/member",
      },
    ],
  },
];

export const ChannelSettingModal: React.FC<ModalProps> = (props) => {
  const channel = useContext(ChannelContext);
  const commonStore = useCommonStore();

  return (
    <Observer>
      {() => (
        <Modal
          {...props}
          title={channel?.name}
          fullScreen
          radius={0}
          transitionProps={{ transition: "fade", duration: 200 }}
        >
          <div className="mx-auto flex w-[1024px]">
            <div className="w-60">
              {SETTINGS.map((setting) => (
                <NavLink
                  variant="filled"
                  key={setting.key}
                  label={<span className="text-xs font-bold">{setting.title}</span>}
                  defaultOpened
                  childrenOffset={0}
                >
                  {setting.items.map((item) => (
                    <NavLink
                      color="teal"
                      variant="light"
                      key={item.link}
                      active={commonStore.settingModalPath === item.link}
                      label={item.title}
                      onClick={() => {
                        runInAction(() => {
                          commonStore.settingModalPath = item.link;
                        });
                      }}
                    />
                  ))}
                </NavLink>
              ))}
            </div>
            <div className="flex-1 pl-8">
              <Suspense fallback={<Loader />}>
                {commonStore.settingModalPath === "user/profile" ? <UserProfile /> : null}
                {commonStore.settingModalPath === "app/audio" ? <AppAudio /> : null}
              </Suspense>
            </div>
          </div>
        </Modal>
      )}
    </Observer>
  );
};
