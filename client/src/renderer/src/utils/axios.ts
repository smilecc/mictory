import { showNotification } from "@mantine/notifications";
import { IConnectServer, STORAGE_ACCESS_TOKEN, STORAGE_CONNECT_SERVERS } from "@renderer/stores/CommonStore";
import axios, { AxiosError, AxiosResponse } from "axios";

export const Request = axios.create();
export interface IApiResult<T = any> {
  code: number;
  message: string;
  data: T;
}
export type IResponse<T> = Promise<AxiosResponse<IApiResult<T>>>;

Request.interceptors.request.use(async (config) => {
  const connectServers: IConnectServer[] = JSON.parse(window.localStorage.getItem(STORAGE_CONNECT_SERVERS) || "[]");
  config.baseURL = config.baseURL || connectServers.find((it) => it.active)?.url;

  const auth = window.localStorage.getItem(STORAGE_ACCESS_TOKEN);
  if (auth) {
    config.headers.Authorization = `Bearer ${auth}`;
  }

  return config;
});

Request.interceptors.response.use(
  (response) => {
    console.log("收到请求响应", response.config.url, response);
    return response;
  },
  (error: AxiosError) => {
    console.log("请求失败", error);
    if (error.isAxiosError) {
      if (error.response?.status === 401) {
      } else if (error.response?.status === 400) {
      } else if (error.response?.status && error.response?.status >= 500) {
      }
    }
    return Promise.reject(error);
  }
);

export function NoticeErrorHandler(e: AxiosError<IApiResult>) {
  if (e.isAxiosError) {
    showNotification({
      color: "red",
      title: "抱歉，出错啦",
      message: e.response?.data?.message || "服务器响应异常",
    });
  }
}
