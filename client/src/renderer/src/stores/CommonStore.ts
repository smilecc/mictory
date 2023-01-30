import { makeAutoObservable, runInAction } from "mobx";
import { Session } from "@renderer/session";
import { IUserInfo, UserApi } from "@renderer/api";

export const STORAGE_CONNECT_SERVERS = "_connect_servers";
export const STORAGE_ACCESS_TOKEN = "_access_token";
export const STORAGE_USER_ID = "_user_id";
export const STORAGE_GAIN_SETTING = "_gain_setting";

export interface IConnectServer {
  url: string;
  host: string;
  nickname: string | null;
  isHttps: boolean;
  version: string;
  accessToken: string | null;
  active: boolean;
}

export interface IGainSetting {
  microphone: number;
  volume: number;
}

export class CommonStore {
  connectServers: IConnectServer[] = [];
  accessToken: string | null;
  session: Session | null = null;
  userInfo: IUserInfo | null = null;
  viewServerId: number = 0;
  joinedServerId: number = 0;
  gainSetting: IGainSetting = {
    microphone: 100,
    volume: 100,
  };

  constructor() {
    makeAutoObservable(this);

    // 初始化音量增益配置
    let gainSettingJson = window.localStorage.getItem(STORAGE_GAIN_SETTING);
    if (gainSettingJson) {
      this.gainSetting = JSON.parse(gainSettingJson);
    }
    window._gainSetting = this.gainSetting;

    this.accessToken = window.localStorage.getItem(STORAGE_ACCESS_TOKEN);
    this.connectServers = JSON.parse(window.localStorage.getItem(STORAGE_CONNECT_SERVERS) || "[]");

    // 激活存储中的服务器
    const activeServer = this.connectServers.find((it) => it.active);
    if (activeServer) {
      this.activeConnectServer(activeServer);
    }
    this.loadUserInfo();
  }

  setGainSetting(gain: IGainSetting) {
    this.gainSetting = gain;
    window._gainSetting = gain;
    window.localStorage.setItem(STORAGE_GAIN_SETTING, JSON.stringify(gain));
  }

  setGainItem(key: keyof IGainSetting, v: number) {
    this.setGainSetting({
      ...this.gainSetting,
      [key]: v,
    });
  }

  addConnectServer(server: IConnectServer) {
    this.connectServers = this.connectServers.filter((it) => it.url !== server.url).concat([server]);
    window.localStorage.setItem(STORAGE_CONNECT_SERVERS, JSON.stringify(this.connectServers));
  }

  removeConnectServer(server: IConnectServer) {
    if (server.host === this.currentConnectServer?.host) {
      this.logout();
    }

    this.connectServers = this.connectServers.filter((it) => it.url !== server.url);
    if (this.connectServers.length > 0) {
      this.activeConnectServer(this.connectServers[0]);
      this.loadUserInfo();
    }
    window.localStorage.setItem(STORAGE_CONNECT_SERVERS, JSON.stringify(this.connectServers));
  }

  activeConnectServer(server: IConnectServer) {
    this.logout();
    this.connectServers = this.connectServers.map((it) => ({
      ...it,
      active: it.url === server.url,
    }));

    this.session?.close();
    this.session = new Session(`${server.isHttps ? "wss" : "ws"}://${server.host}/ws`);
    window.localStorage.setItem(STORAGE_CONNECT_SERVERS, JSON.stringify(this.connectServers));
    if (server.accessToken) {
      this.setAccessToken(server.accessToken);
    }
  }

  get currentConnectServer() {
    return this.connectServers.find((it) => it.active);
  }

  setAccessToken(accessToken: string) {
    window.localStorage.setItem(STORAGE_ACCESS_TOKEN, accessToken);
    this.accessToken = accessToken;
    this.connectServers = this.connectServers.map((it) => ({
      ...it,
      accessToken: it.host === this.currentConnectServer?.host ? accessToken : it.accessToken,
    }));
    window.localStorage.setItem(STORAGE_CONNECT_SERVERS, JSON.stringify(this.connectServers));
  }

  loadUserInfo() {
    return UserApi.getUserInfo(0).then(({ data }) => {
      runInAction(() => {
        this.userInfo = data.data;
        this.connectServers = this.connectServers.map((it) => ({
          ...it,
          nickname: it.host === this.currentConnectServer?.host ? data.data?.nickname || "无昵称" : it.nickname,
        }));
        window.localStorage.setItem(STORAGE_CONNECT_SERVERS, JSON.stringify(this.connectServers));
      });
    });
  }

  logout() {
    this.userInfo = null;
    this.accessToken = null;
    this.joinedServerId = 0;
    this.viewServerId = 0;
    window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
  }
}
