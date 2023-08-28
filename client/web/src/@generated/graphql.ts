/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type BigIntFilter = {
  equals?: InputMaybe<Scalars['BigInt']['input']>;
  gt?: InputMaybe<Scalars['BigInt']['input']>;
  gte?: InputMaybe<Scalars['BigInt']['input']>;
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lt?: InputMaybe<Scalars['BigInt']['input']>;
  lte?: InputMaybe<Scalars['BigInt']['input']>;
  not?: InputMaybe<NestedBigIntFilter>;
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Channel = {
  __typename?: 'Channel';
  _count: ChannelCount;
  /** 频道代号 */
  code: Scalars['String']['output'];
  createdTime: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  /** 频道名 */
  name: Scalars['String']['output'];
  /** 拥有者 */
  ownerUser: User;
  /** 拥有者ID */
  ownerUserId: Scalars['BigInt']['output'];
  /** 房间 */
  rooms?: Maybe<Array<Room>>;
  updatedTime: Scalars['DateTime']['output'];
  /** 频道用户 */
  users?: Maybe<Array<User>>;
};

export type ChannelCount = {
  __typename?: 'ChannelCount';
  rooms: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  userCreate: User;
};


export type MutationUserCreateArgs = {
  data: UserCreateInput;
};

export type NestedBigIntFilter = {
  equals?: InputMaybe<Scalars['BigInt']['input']>;
  gt?: InputMaybe<Scalars['BigInt']['input']>;
  gte?: InputMaybe<Scalars['BigInt']['input']>;
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lt?: InputMaybe<Scalars['BigInt']['input']>;
  lte?: InputMaybe<Scalars['BigInt']['input']>;
  not?: InputMaybe<NestedBigIntFilter>;
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type NestedIntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  test: Scalars['String']['output'];
  user?: Maybe<User>;
};


export type QueryUserArgs = {
  where: UserWhereInput;
};

export type Room = {
  __typename?: 'Room';
  channel: Channel;
  channelId: Scalars['BigInt']['output'];
  createdTime: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  maxMember: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedTime: Scalars['DateTime']['output'];
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** 用户表 */
export type User = {
  __typename?: 'User';
  _count: UserCount;
  /** 加入的频道 */
  channels?: Maybe<Array<Channel>>;
  createdTime: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  /** 昵称 */
  nickname: Scalars['String']['output'];
  /** 昵称编号 */
  nicknameNo: Scalars['Int']['output'];
  /** 拥有的频道 */
  ownedChannels?: Maybe<Array<Channel>>;
  /** 密码 */
  password: Scalars['String']['output'];
  /** 密码盐 */
  passwordSalt: Scalars['String']['output'];
  /** 在线状态 */
  sessionState: UserSessionState;
  updatedTime: Scalars['DateTime']['output'];
  /** 用户名 */
  username: Scalars['String']['output'];
};

export type UserCount = {
  __typename?: 'UserCount';
  channels: Scalars['Int']['output'];
  ownedChannels: Scalars['Int']['output'];
};

export type UserCreateInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  nickname: Scalars['String']['input'];
  nicknameNo: Scalars['Int']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export enum UserSessionState {
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  id?: InputMaybe<BigIntFilter>;
  nickname?: InputMaybe<StringFilter>;
  nicknameNo?: InputMaybe<IntFilter>;
  password?: InputMaybe<StringFilter>;
  username?: InputMaybe<StringFilter>;
};
