import { useCommonStore } from "@/stores";
import { Loader, Modal, NavLink } from "@mantine/core";
import { runInAction } from "mobx";
import { Observer } from "mobx-react-lite";
import { Suspense, lazy } from "react";

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
    key: "user",
    title: "用户设置",
    items: [
      {
        title: "用户资料",
        link: "user/profile",
      },
    ],
  },
  {
    key: "app",
    title: "App设置",
    items: [
      {
        title: "语音设置",
        link: "app/audio",
      },
    ],
  },
];

export const SettingModal: React.FC = () => {
  const commonStore = useCommonStore();

  return (
    <Observer>
      {() => (
        <Modal
          opened={!!commonStore.settingModalPath}
          title="设置"
          onClose={() => {
            runInAction(() => {
              commonStore.settingModalPath = undefined;
            });
          }}
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
