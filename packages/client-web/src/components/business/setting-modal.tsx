import { useCommonStore } from "@/stores";
import { Modal, NavLink } from "@mantine/core";
import { Observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type Settings = {
  title: string;
  items: {
    title: string;
    link: string;
  }[];
}[];

const SETTING_REG = /(.+)\/setting\/(.+)/;

const SETTINGS: Settings = [
  {
    title: "App设置",
    items: [
      {
        title: "语音设置",
        link: "setting/audio",
      },
      {
        title: "语音设置",
        link: "setting/advance",
      },
    ],
  },
];

export const SettingModal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const commonStore = useCommonStore();

  const settingPath = useMemo(() => `setting/${SETTING_REG.exec(location.pathname)?.[2]}`, [location.pathname]);
  const fromPath = useMemo(() => location.pathname.replace(`/${settingPath}`, ""), [location.pathname, settingPath]);

  return (
    <Observer>
      {() => (
        <Modal
          opened={commonStore.settingModalOpen}
          title="设置"
          onClose={() => {
            commonStore.settingModalOpen = false;
            navigate(location.pathname.replace(`/${settingPath}`, ""));
          }}
          fullScreen
          radius={0}
          transitionProps={{ transition: "fade", duration: 200 }}
        >
          <div className="mx-auto flex w-[1024px]">
            <div className="w-60">
              {SETTINGS.map((setting) => (
                <NavLink
                  label={<span className="text-xs font-bold">{setting.title}</span>}
                  defaultOpened
                  childrenOffset={0}
                >
                  {setting.items.map((item) => (
                    <NavLink
                      active={settingPath === item.link}
                      label={item.title}
                      onClick={() => navigate(`${fromPath}/${item.link}`)}
                    />
                  ))}
                </NavLink>
              ))}
            </div>
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </Modal>
      )}
    </Observer>
  );
};
