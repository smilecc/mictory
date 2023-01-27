import { STORAGE_ACCESS_TOKEN } from "@renderer/stores/CommonStore";
import axios, { AxiosError, AxiosResponse } from "axios";

export const Request = axios.create();
export interface IApiResult<T = any> {
  code: number;
  message: string;
  data: T;
}
export type IResponse<T> = Promise<AxiosResponse<IApiResult<T>>>;

Request.interceptors.request.use(async (config) => {
  config.baseURL = `https://rocket.smilec.cc`;

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
