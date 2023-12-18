import { useChannelStore } from "@/stores";
import { Card, Title } from "@mantine/core";
import React, { useEffect } from "react";

const SettingUserProfile: React.FC = () => {
  const channelStore = useChannelStore();

  useEffect(() => {
    channelStore.loadMediaDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Title order={2} className="text-white">
        用户资料
      </Title>
      <div>
        <Title order={5} className="my-4 text-white">
          个人信息
        </Title>

        <Card>1</Card>
      </div>
    </div>
  );
};

export default SettingUserProfile;
