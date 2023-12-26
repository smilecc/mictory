import { ChannelRolePermissionCode } from "@/@generated/graphql";
import { useHasChannelPermission } from "@/utils";
import React from "react";

export const ChannelPermissionWrapper: React.FC<React.PropsWithChildren<{ permission: ChannelRolePermissionCode }>> = ({
  permission,
  children,
}) => {
  const show = useHasChannelPermission(permission);

  if (!show) return null;

  return children;
};
