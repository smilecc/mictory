import { useCommonStore } from "@/stores";
import { Modal, NavLink } from "@mantine/core";
import { Observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const SETTING_REG = /(.+)\/setting\/(.+)/;

export const SettingModal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const commonStore = useCommonStore();

  const settingLocation = useMemo(() => `/setting/${SETTING_REG.exec(location.pathname)?.[2]}`, [location.pathname]);

  return (
    <Observer>
      {() => (
        <Modal
          opened={commonStore.settingModalOpen}
          title="设置"
          onClose={() => {
            commonStore.settingModalOpen = false;
            navigate(location.pathname.replace(settingLocation, ""));
          }}
          fullScreen
          radius={0}
          transitionProps={{ transition: "fade", duration: 200 }}
        >
          <div className="mx-auto flex w-[1024px]">
            <div className="w-60">
              <NavLink label={<span className="text-xs font-bold">App设置</span>} defaultOpened childrenOffset={0}>
                <NavLink label="语音设置" />
                <NavLink label="高级设置" />
              </NavLink>
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
