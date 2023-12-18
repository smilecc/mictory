import { BaseLayout } from "@/components/layout/base-layout";
import React from "react";
import { Outlet } from "react-router-dom";

export const ChannelLayoutPage: React.FC = () => {
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
};
