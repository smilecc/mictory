import { ApolloError } from "@apollo/client";
import { notifications } from "@mantine/notifications";
import { i18n } from "@/i18n";
import axios from "axios";
import type { AxiosInstance } from "axios";
import defaultAvatar from "@/assets/img/default-avatar.jpg";
import defaultUserBg from "@/assets/img/default-user-bg.jpg";
import React from "react";
import { ChannelRolePermissionCode, GetChannelDetailQuery } from "@/@generated/graphql";

export const DEFAULT_AVATAR = defaultAvatar;
export const DEFAULT_USER_BG = defaultUserBg;

export const ChannelContext: React.Context<GetChannelDetailQuery["channels"][0]> =
  React.createContext<GetChannelDetailQuery["channels"][0]>(null);

export const API_HOST = (() => {
  if (import.meta.env.VITE_API_HOST) {
    return import.meta.env.VITE_API_HOST;
  } else if (import.meta.env.DEV) {
    return "http://localhost:3000";
  }

  return "/api";
})();

console.log("API_HOST", API_HOST);

export function NoticeErrorHandler(e: ApolloError) {
  console.error(JSON.stringify(e));
  if (e.graphQLErrors) {
    notifications.show({
      color: "red",
      title: "抱歉，出错啦",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: i18n.t(`errors.${e.message}` as any) || "服务器响应异常",
    });
  }
}

export function sleep(time: number) {
  return new Promise<void>((r) => setTimeout(r, time));
}

let ApiAxios: AxiosInstance;

export function createApiAxios(url: string) {
  return (ApiAxios = axios.create({
    baseURL: url,
  }));
}

export async function ApiAxiosUpload(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return ApiAxios.post<{ name: string }>("/file/upload", formData);
}

export const useChannelPermissions = () => {
  const channel = React.useContext(ChannelContext);

  const userPermissions = React.useMemo(
    () =>
      channel?.currentUser?.channelRole?.permissions
        ? channel.currentUser.channelRole.permissions.map((it) => it.code)
        : [],
    [channel?.currentUser],
  );

  return userPermissions;
};

export const useHasChannelPermission = (permission: ChannelRolePermissionCode) => {
  const permissions = useChannelPermissions();
  const has = React.useMemo(
    () => permissions.includes(ChannelRolePermissionCode.Admin) || permissions.includes(permission),
    [permission, permissions],
  );

  return has;
};
