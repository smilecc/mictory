export interface IUserServer {
  code: string;
  createdTime: string;
  creatorId: number;
  id: number;
  name: string;
  state: string;
  updatedTime: string;
}

export interface IServerRoom {
  createdTime: string;
  id: number;
  maxMember: number;
  name: string;
  serverId: number;
  sort: number;
  updatedTime: string;
}

export interface IServerUser {
  createdTime: string;
  id: number;
  roomId: number;
  serverId: number;
  sessionId: string;
  updatedTime: string;
  userId: number;
  userNickname: string;
  online: boolean;
  sessionOnline: boolean;
}

export interface IUserInfo {
  avatar: null;
  createdTime: string;
  email: string;
  id: number;
  nickname: string;
  nicknameNo: number;
  updatedTime: string;
  sessionOnline: boolean;
}
