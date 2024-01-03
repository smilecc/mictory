/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type BigIntFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['BigInt']['input']>;
  divide?: InputMaybe<Scalars['BigInt']['input']>;
  increment?: InputMaybe<Scalars['BigInt']['input']>;
  multiply?: InputMaybe<Scalars['BigInt']['input']>;
  set?: InputMaybe<Scalars['BigInt']['input']>;
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

export type BigIntNullableFilter = {
  equals?: InputMaybe<Scalars['BigInt']['input']>;
  gt?: InputMaybe<Scalars['BigInt']['input']>;
  gte?: InputMaybe<Scalars['BigInt']['input']>;
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lt?: InputMaybe<Scalars['BigInt']['input']>;
  lte?: InputMaybe<Scalars['BigInt']['input']>;
  not?: InputMaybe<NestedBigIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type BoolFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type Channel = {
  __typename?: 'Channel';
  _count: ChannelCount;
  /** 头像 */
  avatar?: Maybe<Scalars['String']['output']>;
  /** 分组列表 */
  categories?: Maybe<Array<ChannelCategory>>;
  /** 频道代号 */
  code: Scalars['String']['output'];
  createdTime: Scalars['DateTime']['output'];
  /** Current user in channel */
  currentUser?: Maybe<ChannelToUser>;
  id: Scalars['BigInt']['output'];
  /** 频道名 */
  name: Scalars['String']['output'];
  /** 拥有者 */
  ownerUser: User;
  /** 拥有者ID */
  ownerUserId: Scalars['BigInt']['output'];
  /** 角色 */
  roles?: Maybe<Array<ChannelRole>>;
  /** 房间 */
  rooms?: Maybe<Array<Room>>;
  updatedTime: Scalars['DateTime']['output'];
  /** 频道用户 */
  users?: Maybe<Array<ChannelToUser>>;
};

export type ChannelAvgAggregate = {
  __typename?: 'ChannelAvgAggregate';
  id?: Maybe<Scalars['Float']['output']>;
  ownerUserId?: Maybe<Scalars['Float']['output']>;
};

export type ChannelCategory = {
  __typename?: 'ChannelCategory';
  _count: ChannelCategoryCount;
  channel: Channel;
  /** 频道ID */
  channelId: Scalars['BigInt']['output'];
  createdTime: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  /** 名称 */
  name: Scalars['String']['output'];
  /** 房间列表 */
  rooms?: Maybe<Array<Room>>;
  updatedTime: Scalars['DateTime']['output'];
};

export type ChannelCategoryAvgAggregate = {
  __typename?: 'ChannelCategoryAvgAggregate';
  channelId?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

export type ChannelCategoryCount = {
  __typename?: 'ChannelCategoryCount';
  rooms: Scalars['Int']['output'];
};

export type ChannelCategoryCountAggregate = {
  __typename?: 'ChannelCategoryCountAggregate';
  _all: Scalars['Int']['output'];
  channelId: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
};

export type ChannelCategoryCreateManyChannelInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  name: Scalars['String']['input'];
};

export type ChannelCategoryCreateManyChannelInputEnvelope = {
  data: Array<ChannelCategoryCreateManyChannelInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ChannelCategoryCreateNestedManyWithoutChannelInput = {
  connect?: InputMaybe<Array<ChannelCategoryWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChannelCategoryCreateOrConnectWithoutChannelInput>>;
  create?: InputMaybe<Array<ChannelCategoryCreateWithoutChannelInput>>;
  createMany?: InputMaybe<ChannelCategoryCreateManyChannelInputEnvelope>;
};

export type ChannelCategoryCreateNestedOneWithoutRoomsInput = {
  connect?: InputMaybe<ChannelCategoryWhereUniqueInput>;
  connectOrCreate?: InputMaybe<ChannelCategoryCreateOrConnectWithoutRoomsInput>;
  create?: InputMaybe<ChannelCategoryCreateWithoutRoomsInput>;
};

export type ChannelCategoryCreateOrConnectWithoutChannelInput = {
  create: ChannelCategoryCreateWithoutChannelInput;
  where: ChannelCategoryWhereUniqueInput;
};

export type ChannelCategoryCreateOrConnectWithoutRoomsInput = {
  create: ChannelCategoryCreateWithoutRoomsInput;
  where: ChannelCategoryWhereUniqueInput;
};

export type ChannelCategoryCreateWithoutChannelInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  name: Scalars['String']['input'];
  rooms?: InputMaybe<RoomCreateNestedManyWithoutChannelCategoryInput>;
};

export type ChannelCategoryCreateWithoutRoomsInput = {
  channel: ChannelCreateNestedOneWithoutCategoriesInput;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  name: Scalars['String']['input'];
};

export type ChannelCategoryListRelationFilter = {
  every?: InputMaybe<ChannelCategoryWhereInput>;
  none?: InputMaybe<ChannelCategoryWhereInput>;
  some?: InputMaybe<ChannelCategoryWhereInput>;
};

export type ChannelCategoryMaxAggregate = {
  __typename?: 'ChannelCategoryMaxAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ChannelCategoryMinAggregate = {
  __typename?: 'ChannelCategoryMinAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ChannelCategoryOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ChannelCategoryOrderByWithRelationInput = {
  channel?: InputMaybe<ChannelOrderByWithRelationInput>;
  channelId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  rooms?: InputMaybe<RoomOrderByRelationAggregateInput>;
};

export type ChannelCategoryRelationFilter = {
  is?: InputMaybe<ChannelCategoryWhereInput>;
  isNot?: InputMaybe<ChannelCategoryWhereInput>;
};

export type ChannelCategoryScalarWhereInput = {
  AND?: InputMaybe<Array<ChannelCategoryScalarWhereInput>>;
  NOT?: InputMaybe<Array<ChannelCategoryScalarWhereInput>>;
  OR?: InputMaybe<Array<ChannelCategoryScalarWhereInput>>;
  channelId?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<StringFilter>;
};

export type ChannelCategorySumAggregate = {
  __typename?: 'ChannelCategorySumAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelCategoryUpdateManyMutationInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type ChannelCategoryUpdateManyWithWhereWithoutChannelInput = {
  data: ChannelCategoryUpdateManyMutationInput;
  where: ChannelCategoryScalarWhereInput;
};

export type ChannelCategoryUpdateManyWithoutChannelNestedInput = {
  connect?: InputMaybe<Array<ChannelCategoryWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChannelCategoryCreateOrConnectWithoutChannelInput>>;
  create?: InputMaybe<Array<ChannelCategoryCreateWithoutChannelInput>>;
  createMany?: InputMaybe<ChannelCategoryCreateManyChannelInputEnvelope>;
  delete?: InputMaybe<Array<ChannelCategoryWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<ChannelCategoryScalarWhereInput>>;
  disconnect?: InputMaybe<Array<ChannelCategoryWhereUniqueInput>>;
  set?: InputMaybe<Array<ChannelCategoryWhereUniqueInput>>;
  update?: InputMaybe<Array<ChannelCategoryUpdateWithWhereUniqueWithoutChannelInput>>;
  updateMany?: InputMaybe<Array<ChannelCategoryUpdateManyWithWhereWithoutChannelInput>>;
  upsert?: InputMaybe<Array<ChannelCategoryUpsertWithWhereUniqueWithoutChannelInput>>;
};

export type ChannelCategoryUpdateOneRequiredWithoutRoomsNestedInput = {
  connect?: InputMaybe<ChannelCategoryWhereUniqueInput>;
  connectOrCreate?: InputMaybe<ChannelCategoryCreateOrConnectWithoutRoomsInput>;
  create?: InputMaybe<ChannelCategoryCreateWithoutRoomsInput>;
  update?: InputMaybe<ChannelCategoryUpdateToOneWithWhereWithoutRoomsInput>;
  upsert?: InputMaybe<ChannelCategoryUpsertWithoutRoomsInput>;
};

export type ChannelCategoryUpdateToOneWithWhereWithoutRoomsInput = {
  data: ChannelCategoryUpdateWithoutRoomsInput;
  where?: InputMaybe<ChannelCategoryWhereInput>;
};

export type ChannelCategoryUpdateWithWhereUniqueWithoutChannelInput = {
  data: ChannelCategoryUpdateWithoutChannelInput;
  where: ChannelCategoryWhereUniqueInput;
};

export type ChannelCategoryUpdateWithoutChannelInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  rooms?: InputMaybe<RoomUpdateManyWithoutChannelCategoryNestedInput>;
};

export type ChannelCategoryUpdateWithoutRoomsInput = {
  channel?: InputMaybe<ChannelUpdateOneRequiredWithoutCategoriesNestedInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type ChannelCategoryUpsertWithWhereUniqueWithoutChannelInput = {
  create: ChannelCategoryCreateWithoutChannelInput;
  update: ChannelCategoryUpdateWithoutChannelInput;
  where: ChannelCategoryWhereUniqueInput;
};

export type ChannelCategoryUpsertWithoutRoomsInput = {
  create: ChannelCategoryCreateWithoutRoomsInput;
  update: ChannelCategoryUpdateWithoutRoomsInput;
  where?: InputMaybe<ChannelCategoryWhereInput>;
};

export type ChannelCategoryWhereInput = {
  AND?: InputMaybe<Array<ChannelCategoryWhereInput>>;
  NOT?: InputMaybe<Array<ChannelCategoryWhereInput>>;
  OR?: InputMaybe<Array<ChannelCategoryWhereInput>>;
  channel?: InputMaybe<ChannelRelationFilter>;
  channelId?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<StringFilter>;
  rooms?: InputMaybe<RoomListRelationFilter>;
};

export type ChannelCategoryWhereUniqueInput = {
  AND?: InputMaybe<Array<ChannelCategoryWhereInput>>;
  NOT?: InputMaybe<Array<ChannelCategoryWhereInput>>;
  OR?: InputMaybe<Array<ChannelCategoryWhereInput>>;
  channel?: InputMaybe<ChannelRelationFilter>;
  channelId?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  name?: InputMaybe<StringFilter>;
  rooms?: InputMaybe<RoomListRelationFilter>;
};

export type ChannelCount = {
  __typename?: 'ChannelCount';
  categories: Scalars['Int']['output'];
  invites: Scalars['Int']['output'];
  roles: Scalars['Int']['output'];
  rooms: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type ChannelCountAggregate = {
  __typename?: 'ChannelCountAggregate';
  _all: Scalars['Int']['output'];
  avatar: Scalars['Int']['output'];
  code: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['Int']['output'];
  ownerUserId: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
};

export type ChannelCreateInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<ChannelCategoryCreateNestedManyWithoutChannelInput>;
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  name: Scalars['String']['input'];
  rooms?: InputMaybe<RoomCreateNestedManyWithoutChannelInput>;
};

export type ChannelCreateNestedOneWithoutCategoriesInput = {
  connect?: InputMaybe<ChannelWhereUniqueInput>;
  connectOrCreate?: InputMaybe<ChannelCreateOrConnectWithoutCategoriesInput>;
  create?: InputMaybe<ChannelCreateWithoutCategoriesInput>;
};

export type ChannelCreateNestedOneWithoutInvitesInput = {
  connect?: InputMaybe<ChannelWhereUniqueInput>;
  connectOrCreate?: InputMaybe<ChannelCreateOrConnectWithoutInvitesInput>;
  create?: InputMaybe<ChannelCreateWithoutInvitesInput>;
};

export type ChannelCreateOrConnectWithoutCategoriesInput = {
  create: ChannelCreateWithoutCategoriesInput;
  where: ChannelWhereUniqueInput;
};

export type ChannelCreateOrConnectWithoutInvitesInput = {
  create: ChannelCreateWithoutInvitesInput;
  where: ChannelWhereUniqueInput;
};

export type ChannelCreateWithoutCategoriesInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  name: Scalars['String']['input'];
  rooms?: InputMaybe<RoomCreateNestedManyWithoutChannelInput>;
};

export type ChannelCreateWithoutInvitesInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<ChannelCategoryCreateNestedManyWithoutChannelInput>;
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  name: Scalars['String']['input'];
  rooms?: InputMaybe<RoomCreateNestedManyWithoutChannelInput>;
};

export type ChannelInvite = {
  __typename?: 'ChannelInvite';
  /** 频道 */
  channel: Channel;
  channelId: Scalars['BigInt']['output'];
  /** 邀请码 */
  code: Scalars['String']['output'];
  createdTime: Scalars['DateTime']['output'];
  /** 有效天数 */
  days: Scalars['Int']['output'];
  /** 有效期 */
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['BigInt']['output'];
  updatedTime: Scalars['DateTime']['output'];
  /** 创建用户 */
  user: User;
  userId: Scalars['BigInt']['output'];
};

export type ChannelInviteAvgAggregate = {
  __typename?: 'ChannelInviteAvgAggregate';
  channelId?: Maybe<Scalars['Float']['output']>;
  days?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  userId?: Maybe<Scalars['Float']['output']>;
};

export type ChannelInviteCountAggregate = {
  __typename?: 'ChannelInviteCountAggregate';
  _all: Scalars['Int']['output'];
  channelId: Scalars['Int']['output'];
  code: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  days: Scalars['Int']['output'];
  expireAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type ChannelInviteCreateManyUserInput = {
  channelId: Scalars['BigInt']['input'];
  code: Scalars['String']['input'];
  days?: InputMaybe<Scalars['Int']['input']>;
  expireAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
};

export type ChannelInviteCreateManyUserInputEnvelope = {
  data: Array<ChannelInviteCreateManyUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ChannelInviteCreateNestedManyWithoutUserInput = {
  connect?: InputMaybe<Array<ChannelInviteWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChannelInviteCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<ChannelInviteCreateWithoutUserInput>>;
  createMany?: InputMaybe<ChannelInviteCreateManyUserInputEnvelope>;
};

export type ChannelInviteCreateOrConnectWithoutUserInput = {
  create: ChannelInviteCreateWithoutUserInput;
  where: ChannelInviteWhereUniqueInput;
};

export type ChannelInviteCreateWithoutUserInput = {
  channel: ChannelCreateNestedOneWithoutInvitesInput;
  code: Scalars['String']['input'];
  days?: InputMaybe<Scalars['Int']['input']>;
  expireAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
};

export type ChannelInviteListRelationFilter = {
  every?: InputMaybe<ChannelInviteWhereInput>;
  none?: InputMaybe<ChannelInviteWhereInput>;
  some?: InputMaybe<ChannelInviteWhereInput>;
};

export type ChannelInviteMaxAggregate = {
  __typename?: 'ChannelInviteMaxAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  days?: Maybe<Scalars['Int']['output']>;
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelInviteMinAggregate = {
  __typename?: 'ChannelInviteMinAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  days?: Maybe<Scalars['Int']['output']>;
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelInviteOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ChannelInviteScalarWhereInput = {
  AND?: InputMaybe<Array<ChannelInviteScalarWhereInput>>;
  NOT?: InputMaybe<Array<ChannelInviteScalarWhereInput>>;
  OR?: InputMaybe<Array<ChannelInviteScalarWhereInput>>;
  channelId?: InputMaybe<BigIntFilter>;
  code?: InputMaybe<StringFilter>;
  days?: InputMaybe<IntFilter>;
  expireAt?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<BigIntFilter>;
  userId?: InputMaybe<BigIntFilter>;
};

export type ChannelInviteSumAggregate = {
  __typename?: 'ChannelInviteSumAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  days?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelInviteUpdateManyMutationInput = {
  code?: InputMaybe<StringFieldUpdateOperationsInput>;
  days?: InputMaybe<IntFieldUpdateOperationsInput>;
  expireAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
};

export type ChannelInviteUpdateManyWithWhereWithoutUserInput = {
  data: ChannelInviteUpdateManyMutationInput;
  where: ChannelInviteScalarWhereInput;
};

export type ChannelInviteUpdateManyWithoutUserNestedInput = {
  connect?: InputMaybe<Array<ChannelInviteWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChannelInviteCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<ChannelInviteCreateWithoutUserInput>>;
  createMany?: InputMaybe<ChannelInviteCreateManyUserInputEnvelope>;
  delete?: InputMaybe<Array<ChannelInviteWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<ChannelInviteScalarWhereInput>>;
  disconnect?: InputMaybe<Array<ChannelInviteWhereUniqueInput>>;
  set?: InputMaybe<Array<ChannelInviteWhereUniqueInput>>;
  update?: InputMaybe<Array<ChannelInviteUpdateWithWhereUniqueWithoutUserInput>>;
  updateMany?: InputMaybe<Array<ChannelInviteUpdateManyWithWhereWithoutUserInput>>;
  upsert?: InputMaybe<Array<ChannelInviteUpsertWithWhereUniqueWithoutUserInput>>;
};

export type ChannelInviteUpdateWithWhereUniqueWithoutUserInput = {
  data: ChannelInviteUpdateWithoutUserInput;
  where: ChannelInviteWhereUniqueInput;
};

export type ChannelInviteUpdateWithoutUserInput = {
  channel?: InputMaybe<ChannelUpdateOneRequiredWithoutInvitesNestedInput>;
  code?: InputMaybe<StringFieldUpdateOperationsInput>;
  days?: InputMaybe<IntFieldUpdateOperationsInput>;
  expireAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
};

export type ChannelInviteUpsertWithWhereUniqueWithoutUserInput = {
  create: ChannelInviteCreateWithoutUserInput;
  update: ChannelInviteUpdateWithoutUserInput;
  where: ChannelInviteWhereUniqueInput;
};

export type ChannelInviteWhereInput = {
  AND?: InputMaybe<Array<ChannelInviteWhereInput>>;
  NOT?: InputMaybe<Array<ChannelInviteWhereInput>>;
  OR?: InputMaybe<Array<ChannelInviteWhereInput>>;
  channel?: InputMaybe<ChannelRelationFilter>;
  channelId?: InputMaybe<BigIntFilter>;
  code?: InputMaybe<StringFilter>;
  days?: InputMaybe<IntFilter>;
  expireAt?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<BigIntFilter>;
  user?: InputMaybe<UserRelationFilter>;
  userId?: InputMaybe<BigIntFilter>;
};

export type ChannelInviteWhereUniqueInput = {
  AND?: InputMaybe<Array<ChannelInviteWhereInput>>;
  NOT?: InputMaybe<Array<ChannelInviteWhereInput>>;
  OR?: InputMaybe<Array<ChannelInviteWhereInput>>;
  channel?: InputMaybe<ChannelRelationFilter>;
  channelId?: InputMaybe<BigIntFilter>;
  code?: InputMaybe<Scalars['String']['input']>;
  days?: InputMaybe<IntFilter>;
  expireAt?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  user?: InputMaybe<UserRelationFilter>;
  userId?: InputMaybe<BigIntFilter>;
};

export type ChannelJoinInput = {
  code: Scalars['String']['input'];
};

export type ChannelMaxAggregate = {
  __typename?: 'ChannelMaxAggregate';
  avatar?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  ownerUserId?: Maybe<Scalars['BigInt']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ChannelMinAggregate = {
  __typename?: 'ChannelMinAggregate';
  avatar?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  ownerUserId?: Maybe<Scalars['BigInt']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ChannelOrderByWithRelationInput = {
  avatar?: InputMaybe<SortOrderInput>;
  categories?: InputMaybe<ChannelCategoryOrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  ownerUser?: InputMaybe<UserOrderByWithRelationInput>;
  ownerUserId?: InputMaybe<SortOrder>;
  roles?: InputMaybe<ChannelRoleOrderByRelationAggregateInput>;
  rooms?: InputMaybe<RoomOrderByRelationAggregateInput>;
  users?: InputMaybe<ChannelToUserOrderByRelationAggregateInput>;
};

export type ChannelRelationFilter = {
  is?: InputMaybe<ChannelWhereInput>;
  isNot?: InputMaybe<ChannelWhereInput>;
};

export type ChannelRole = {
  __typename?: 'ChannelRole';
  _count: ChannelRoleCount;
  channel: Channel;
  channelId: Scalars['BigInt']['output'];
  channelUsers?: Maybe<Array<ChannelToUser>>;
  /** 颜色 */
  color?: Maybe<Scalars['String']['output']>;
  createdTime: Scalars['DateTime']['output'];
  /** 默认角色 */
  defaultRole: Scalars['Boolean']['output'];
  id: Scalars['BigInt']['output'];
  /** 角色名称 */
  name: Scalars['String']['output'];
  /** 权限列表 */
  permissions?: Maybe<Array<ChannelRolePermission>>;
  updatedTime: Scalars['DateTime']['output'];
};

export type ChannelRoleAvgAggregate = {
  __typename?: 'ChannelRoleAvgAggregate';
  channelId?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

export type ChannelRoleCount = {
  __typename?: 'ChannelRoleCount';
  channelUsers: Scalars['Int']['output'];
  permissions: Scalars['Int']['output'];
};

export type ChannelRoleCountAggregate = {
  __typename?: 'ChannelRoleCountAggregate';
  _all: Scalars['Int']['output'];
  channelId: Scalars['Int']['output'];
  color: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  defaultRole: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
};

export type ChannelRoleListRelationFilter = {
  every?: InputMaybe<ChannelRoleWhereInput>;
  none?: InputMaybe<ChannelRoleWhereInput>;
  some?: InputMaybe<ChannelRoleWhereInput>;
};

export type ChannelRoleMaxAggregate = {
  __typename?: 'ChannelRoleMaxAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  defaultRole?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ChannelRoleMinAggregate = {
  __typename?: 'ChannelRoleMinAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  defaultRole?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ChannelRoleOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ChannelRolePermission = {
  __typename?: 'ChannelRolePermission';
  _count: ChannelRolePermissionCount;
  /** 权限编码 */
  code: ChannelRolePermissionCode;
  createdTime: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  /** 关联角色 */
  role?: Maybe<Array<ChannelRole>>;
  updatedTime: Scalars['DateTime']['output'];
};

export type ChannelRolePermissionAvgAggregate = {
  __typename?: 'ChannelRolePermissionAvgAggregate';
  id?: Maybe<Scalars['Float']['output']>;
};

export enum ChannelRolePermissionCode {
  Admin = 'ADMIN',
  Invite = 'INVITE',
  SendChat = 'SEND_CHAT',
  Voice = 'VOICE'
}

export type ChannelRolePermissionCount = {
  __typename?: 'ChannelRolePermissionCount';
  role: Scalars['Int']['output'];
};

export type ChannelRolePermissionCountAggregate = {
  __typename?: 'ChannelRolePermissionCountAggregate';
  _all: Scalars['Int']['output'];
  code: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
};

export type ChannelRolePermissionListRelationFilter = {
  every?: InputMaybe<ChannelRolePermissionWhereInput>;
  none?: InputMaybe<ChannelRolePermissionWhereInput>;
  some?: InputMaybe<ChannelRolePermissionWhereInput>;
};

export type ChannelRolePermissionMaxAggregate = {
  __typename?: 'ChannelRolePermissionMaxAggregate';
  code?: Maybe<ChannelRolePermissionCode>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ChannelRolePermissionMinAggregate = {
  __typename?: 'ChannelRolePermissionMinAggregate';
  code?: Maybe<ChannelRolePermissionCode>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ChannelRolePermissionSumAggregate = {
  __typename?: 'ChannelRolePermissionSumAggregate';
  id?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelRolePermissionWhereInput = {
  AND?: InputMaybe<Array<ChannelRolePermissionWhereInput>>;
  NOT?: InputMaybe<Array<ChannelRolePermissionWhereInput>>;
  OR?: InputMaybe<Array<ChannelRolePermissionWhereInput>>;
  code?: InputMaybe<EnumChannelRolePermissionCodeFilter>;
  id?: InputMaybe<BigIntFilter>;
  role?: InputMaybe<ChannelRoleListRelationFilter>;
};

export type ChannelRoleRelationFilter = {
  is?: InputMaybe<ChannelRoleWhereInput>;
  isNot?: InputMaybe<ChannelRoleWhereInput>;
};

export type ChannelRoleSumAggregate = {
  __typename?: 'ChannelRoleSumAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelRoleWhereInput = {
  AND?: InputMaybe<Array<ChannelRoleWhereInput>>;
  NOT?: InputMaybe<Array<ChannelRoleWhereInput>>;
  OR?: InputMaybe<Array<ChannelRoleWhereInput>>;
  channel?: InputMaybe<ChannelRelationFilter>;
  channelId?: InputMaybe<BigIntFilter>;
  channelUsers?: InputMaybe<ChannelToUserListRelationFilter>;
  color?: InputMaybe<StringNullableFilter>;
  defaultRole?: InputMaybe<BoolFilter>;
  id?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<StringFilter>;
  permissions?: InputMaybe<ChannelRolePermissionListRelationFilter>;
};

export enum ChannelScalarFieldEnum {
  Avatar = 'avatar',
  Code = 'code',
  CreatedTime = 'createdTime',
  DeletedTime = 'deletedTime',
  Id = 'id',
  Name = 'name',
  OwnerUserId = 'ownerUserId',
  UpdatedTime = 'updatedTime'
}

export type ChannelSumAggregate = {
  __typename?: 'ChannelSumAggregate';
  id?: Maybe<Scalars['BigInt']['output']>;
  ownerUserId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelToUser = {
  __typename?: 'ChannelToUser';
  channel: Channel;
  channelId: Scalars['BigInt']['output'];
  channelRole: ChannelRole;
  channelRoleId: Scalars['BigInt']['output'];
  user: User;
  userId: Scalars['BigInt']['output'];
};

export type ChannelToUserAvgAggregate = {
  __typename?: 'ChannelToUserAvgAggregate';
  channelId?: Maybe<Scalars['Float']['output']>;
  channelRoleId?: Maybe<Scalars['Float']['output']>;
  userId?: Maybe<Scalars['Float']['output']>;
};

export type ChannelToUserCountAggregate = {
  __typename?: 'ChannelToUserCountAggregate';
  _all: Scalars['Int']['output'];
  channelId: Scalars['Int']['output'];
  channelRoleId: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type ChannelToUserListRelationFilter = {
  every?: InputMaybe<ChannelToUserWhereInput>;
  none?: InputMaybe<ChannelToUserWhereInput>;
  some?: InputMaybe<ChannelToUserWhereInput>;
};

export type ChannelToUserMaxAggregate = {
  __typename?: 'ChannelToUserMaxAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  channelRoleId?: Maybe<Scalars['BigInt']['output']>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelToUserMinAggregate = {
  __typename?: 'ChannelToUserMinAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  channelRoleId?: Maybe<Scalars['BigInt']['output']>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelToUserOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ChannelToUserSumAggregate = {
  __typename?: 'ChannelToUserSumAggregate';
  channelId?: Maybe<Scalars['BigInt']['output']>;
  channelRoleId?: Maybe<Scalars['BigInt']['output']>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChannelToUserWhereInput = {
  AND?: InputMaybe<Array<ChannelToUserWhereInput>>;
  NOT?: InputMaybe<Array<ChannelToUserWhereInput>>;
  OR?: InputMaybe<Array<ChannelToUserWhereInput>>;
  channel?: InputMaybe<ChannelRelationFilter>;
  channelId?: InputMaybe<BigIntFilter>;
  channelRole?: InputMaybe<ChannelRoleRelationFilter>;
  channelRoleId?: InputMaybe<BigIntFilter>;
  user?: InputMaybe<UserRelationFilter>;
  userId?: InputMaybe<BigIntFilter>;
};

export type ChannelUpdateInput = {
  avatar?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  categories?: InputMaybe<ChannelCategoryUpdateManyWithoutChannelNestedInput>;
  code?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  rooms?: InputMaybe<RoomUpdateManyWithoutChannelNestedInput>;
};

export type ChannelUpdateOneRequiredWithoutCategoriesNestedInput = {
  connect?: InputMaybe<ChannelWhereUniqueInput>;
  connectOrCreate?: InputMaybe<ChannelCreateOrConnectWithoutCategoriesInput>;
  create?: InputMaybe<ChannelCreateWithoutCategoriesInput>;
  update?: InputMaybe<ChannelUpdateToOneWithWhereWithoutCategoriesInput>;
  upsert?: InputMaybe<ChannelUpsertWithoutCategoriesInput>;
};

export type ChannelUpdateOneRequiredWithoutInvitesNestedInput = {
  connect?: InputMaybe<ChannelWhereUniqueInput>;
  connectOrCreate?: InputMaybe<ChannelCreateOrConnectWithoutInvitesInput>;
  create?: InputMaybe<ChannelCreateWithoutInvitesInput>;
  update?: InputMaybe<ChannelUpdateToOneWithWhereWithoutInvitesInput>;
  upsert?: InputMaybe<ChannelUpsertWithoutInvitesInput>;
};

export type ChannelUpdateToOneWithWhereWithoutCategoriesInput = {
  data: ChannelUpdateWithoutCategoriesInput;
  where?: InputMaybe<ChannelWhereInput>;
};

export type ChannelUpdateToOneWithWhereWithoutInvitesInput = {
  data: ChannelUpdateWithoutInvitesInput;
  where?: InputMaybe<ChannelWhereInput>;
};

export type ChannelUpdateWithoutCategoriesInput = {
  avatar?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  code?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  rooms?: InputMaybe<RoomUpdateManyWithoutChannelNestedInput>;
};

export type ChannelUpdateWithoutInvitesInput = {
  avatar?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  categories?: InputMaybe<ChannelCategoryUpdateManyWithoutChannelNestedInput>;
  code?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  rooms?: InputMaybe<RoomUpdateManyWithoutChannelNestedInput>;
};

export type ChannelUpsertWithoutCategoriesInput = {
  create: ChannelCreateWithoutCategoriesInput;
  update: ChannelUpdateWithoutCategoriesInput;
  where?: InputMaybe<ChannelWhereInput>;
};

export type ChannelUpsertWithoutInvitesInput = {
  create: ChannelCreateWithoutInvitesInput;
  update: ChannelUpdateWithoutInvitesInput;
  where?: InputMaybe<ChannelWhereInput>;
};

export type ChannelWhereInput = {
  AND?: InputMaybe<Array<ChannelWhereInput>>;
  NOT?: InputMaybe<Array<ChannelWhereInput>>;
  OR?: InputMaybe<Array<ChannelWhereInput>>;
  avatar?: InputMaybe<StringNullableFilter>;
  categories?: InputMaybe<ChannelCategoryListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  id?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<StringFilter>;
  ownerUser?: InputMaybe<UserRelationFilter>;
  ownerUserId?: InputMaybe<BigIntFilter>;
  roles?: InputMaybe<ChannelRoleListRelationFilter>;
  rooms?: InputMaybe<RoomListRelationFilter>;
  users?: InputMaybe<ChannelToUserListRelationFilter>;
};

export type ChannelWhereUniqueInput = {
  AND?: InputMaybe<Array<ChannelWhereInput>>;
  NOT?: InputMaybe<Array<ChannelWhereInput>>;
  OR?: InputMaybe<Array<ChannelWhereInput>>;
  avatar?: InputMaybe<StringNullableFilter>;
  categories?: InputMaybe<ChannelCategoryListRelationFilter>;
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  name?: InputMaybe<StringFilter>;
  ownerUser?: InputMaybe<UserRelationFilter>;
  ownerUserId?: InputMaybe<BigIntFilter>;
  roles?: InputMaybe<ChannelRoleListRelationFilter>;
  rooms?: InputMaybe<RoomListRelationFilter>;
  users?: InputMaybe<ChannelToUserListRelationFilter>;
};

/** 聊天表 */
export type Chat = {
  __typename?: 'Chat';
  createdTime: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  /** 消息内容 */
  message: Scalars['JSON']['output'];
  /** 消息纯文本 */
  plainText: Scalars['String']['output'];
  /** 房间 */
  room?: Maybe<Room>;
  roomId?: Maybe<Scalars['BigInt']['output']>;
  /** 对话目标 */
  target: ChatTarget;
  /** 目标用户 */
  targetUser?: Maybe<User>;
  targetUserId?: Maybe<Scalars['BigInt']['output']>;
  /** 消息类型 */
  type: ChatType;
  updatedTime: Scalars['DateTime']['output'];
  /** 用户ID */
  user?: Maybe<User>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChatAvgAggregate = {
  __typename?: 'ChatAvgAggregate';
  id?: Maybe<Scalars['Float']['output']>;
  roomId?: Maybe<Scalars['Float']['output']>;
  targetUserId?: Maybe<Scalars['Float']['output']>;
  userId?: Maybe<Scalars['Float']['output']>;
};

export type ChatCountAggregate = {
  __typename?: 'ChatCountAggregate';
  _all: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  message: Scalars['Int']['output'];
  plainText: Scalars['Int']['output'];
  roomId: Scalars['Int']['output'];
  target: Scalars['Int']['output'];
  targetUserId: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type ChatCreateInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  message: Scalars['JSON']['input'];
  plainText?: InputMaybe<Scalars['String']['input']>;
  room?: InputMaybe<RoomCreateNestedOneWithoutChatsInput>;
  target: ChatTarget;
  targetUser?: InputMaybe<UserCreateNestedOneWithoutTargetChatsInput>;
  type?: InputMaybe<ChatType>;
  user?: InputMaybe<UserCreateNestedOneWithoutFromChatsInput>;
};

export type ChatCreateManyRoomInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  message: Scalars['JSON']['input'];
  plainText?: InputMaybe<Scalars['String']['input']>;
  target: ChatTarget;
  targetUserId?: InputMaybe<Scalars['BigInt']['input']>;
  type?: InputMaybe<ChatType>;
  userId?: InputMaybe<Scalars['BigInt']['input']>;
};

export type ChatCreateManyRoomInputEnvelope = {
  data: Array<ChatCreateManyRoomInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ChatCreateManyTargetUserInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  message: Scalars['JSON']['input'];
  plainText?: InputMaybe<Scalars['String']['input']>;
  roomId?: InputMaybe<Scalars['BigInt']['input']>;
  target: ChatTarget;
  type?: InputMaybe<ChatType>;
  userId?: InputMaybe<Scalars['BigInt']['input']>;
};

export type ChatCreateManyTargetUserInputEnvelope = {
  data: Array<ChatCreateManyTargetUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ChatCreateManyUserInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  message: Scalars['JSON']['input'];
  plainText?: InputMaybe<Scalars['String']['input']>;
  roomId?: InputMaybe<Scalars['BigInt']['input']>;
  target: ChatTarget;
  targetUserId?: InputMaybe<Scalars['BigInt']['input']>;
  type?: InputMaybe<ChatType>;
};

export type ChatCreateManyUserInputEnvelope = {
  data: Array<ChatCreateManyUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ChatCreateNestedManyWithoutRoomInput = {
  connect?: InputMaybe<Array<ChatWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChatCreateOrConnectWithoutRoomInput>>;
  create?: InputMaybe<Array<ChatCreateWithoutRoomInput>>;
  createMany?: InputMaybe<ChatCreateManyRoomInputEnvelope>;
};

export type ChatCreateNestedManyWithoutTargetUserInput = {
  connect?: InputMaybe<Array<ChatWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChatCreateOrConnectWithoutTargetUserInput>>;
  create?: InputMaybe<Array<ChatCreateWithoutTargetUserInput>>;
  createMany?: InputMaybe<ChatCreateManyTargetUserInputEnvelope>;
};

export type ChatCreateNestedManyWithoutUserInput = {
  connect?: InputMaybe<Array<ChatWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChatCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<ChatCreateWithoutUserInput>>;
  createMany?: InputMaybe<ChatCreateManyUserInputEnvelope>;
};

export type ChatCreateOrConnectWithoutRoomInput = {
  create: ChatCreateWithoutRoomInput;
  where: ChatWhereUniqueInput;
};

export type ChatCreateOrConnectWithoutTargetUserInput = {
  create: ChatCreateWithoutTargetUserInput;
  where: ChatWhereUniqueInput;
};

export type ChatCreateOrConnectWithoutUserInput = {
  create: ChatCreateWithoutUserInput;
  where: ChatWhereUniqueInput;
};

export type ChatCreateWithoutRoomInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  message: Scalars['JSON']['input'];
  plainText?: InputMaybe<Scalars['String']['input']>;
  target: ChatTarget;
  targetUser?: InputMaybe<UserCreateNestedOneWithoutTargetChatsInput>;
  type?: InputMaybe<ChatType>;
  user?: InputMaybe<UserCreateNestedOneWithoutFromChatsInput>;
};

export type ChatCreateWithoutTargetUserInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  message: Scalars['JSON']['input'];
  plainText?: InputMaybe<Scalars['String']['input']>;
  room?: InputMaybe<RoomCreateNestedOneWithoutChatsInput>;
  target: ChatTarget;
  type?: InputMaybe<ChatType>;
  user?: InputMaybe<UserCreateNestedOneWithoutFromChatsInput>;
};

export type ChatCreateWithoutUserInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  message: Scalars['JSON']['input'];
  plainText?: InputMaybe<Scalars['String']['input']>;
  room?: InputMaybe<RoomCreateNestedOneWithoutChatsInput>;
  target: ChatTarget;
  targetUser?: InputMaybe<UserCreateNestedOneWithoutTargetChatsInput>;
  type?: InputMaybe<ChatType>;
};

export type ChatListRelationFilter = {
  every?: InputMaybe<ChatWhereInput>;
  none?: InputMaybe<ChatWhereInput>;
  some?: InputMaybe<ChatWhereInput>;
};

export type ChatMaxAggregate = {
  __typename?: 'ChatMaxAggregate';
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  plainText?: Maybe<Scalars['String']['output']>;
  roomId?: Maybe<Scalars['BigInt']['output']>;
  target?: Maybe<ChatTarget>;
  targetUserId?: Maybe<Scalars['BigInt']['output']>;
  type?: Maybe<ChatType>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChatMinAggregate = {
  __typename?: 'ChatMinAggregate';
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  plainText?: Maybe<Scalars['String']['output']>;
  roomId?: Maybe<Scalars['BigInt']['output']>;
  target?: Maybe<ChatTarget>;
  targetUserId?: Maybe<Scalars['BigInt']['output']>;
  type?: Maybe<ChatType>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export type ChatOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ChatOrderByWithRelationInput = {
  id?: InputMaybe<SortOrder>;
  message?: InputMaybe<SortOrder>;
  plainText?: InputMaybe<SortOrder>;
  room?: InputMaybe<RoomOrderByWithRelationInput>;
  roomId?: InputMaybe<SortOrderInput>;
  target?: InputMaybe<SortOrder>;
  targetUser?: InputMaybe<UserOrderByWithRelationInput>;
  targetUserId?: InputMaybe<SortOrderInput>;
  type?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrderInput>;
};

export enum ChatScalarFieldEnum {
  CreatedTime = 'createdTime',
  DeletedTime = 'deletedTime',
  Id = 'id',
  Message = 'message',
  PlainText = 'plainText',
  RoomId = 'roomId',
  Target = 'target',
  TargetUserId = 'targetUserId',
  Type = 'type',
  UpdatedTime = 'updatedTime',
  UserId = 'userId'
}

export type ChatScalarWhereInput = {
  AND?: InputMaybe<Array<ChatScalarWhereInput>>;
  NOT?: InputMaybe<Array<ChatScalarWhereInput>>;
  OR?: InputMaybe<Array<ChatScalarWhereInput>>;
  id?: InputMaybe<BigIntFilter>;
  message?: InputMaybe<JsonFilter>;
  plainText?: InputMaybe<StringFilter>;
  roomId?: InputMaybe<BigIntNullableFilter>;
  target?: InputMaybe<EnumChatTargetFilter>;
  targetUserId?: InputMaybe<BigIntNullableFilter>;
  type?: InputMaybe<EnumChatTypeFilter>;
  userId?: InputMaybe<BigIntNullableFilter>;
};

export type ChatSumAggregate = {
  __typename?: 'ChatSumAggregate';
  id?: Maybe<Scalars['BigInt']['output']>;
  roomId?: Maybe<Scalars['BigInt']['output']>;
  targetUserId?: Maybe<Scalars['BigInt']['output']>;
  userId?: Maybe<Scalars['BigInt']['output']>;
};

export enum ChatTarget {
  Room = 'ROOM',
  User = 'USER'
}

export enum ChatType {
  System = 'SYSTEM',
  User = 'USER'
}

export type ChatUpdateManyMutationInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  message?: InputMaybe<Scalars['JSON']['input']>;
  plainText?: InputMaybe<StringFieldUpdateOperationsInput>;
  target?: InputMaybe<EnumChatTargetFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumChatTypeFieldUpdateOperationsInput>;
};

export type ChatUpdateManyWithWhereWithoutRoomInput = {
  data: ChatUpdateManyMutationInput;
  where: ChatScalarWhereInput;
};

export type ChatUpdateManyWithWhereWithoutTargetUserInput = {
  data: ChatUpdateManyMutationInput;
  where: ChatScalarWhereInput;
};

export type ChatUpdateManyWithWhereWithoutUserInput = {
  data: ChatUpdateManyMutationInput;
  where: ChatScalarWhereInput;
};

export type ChatUpdateManyWithoutRoomNestedInput = {
  connect?: InputMaybe<Array<ChatWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChatCreateOrConnectWithoutRoomInput>>;
  create?: InputMaybe<Array<ChatCreateWithoutRoomInput>>;
  createMany?: InputMaybe<ChatCreateManyRoomInputEnvelope>;
  delete?: InputMaybe<Array<ChatWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<ChatScalarWhereInput>>;
  disconnect?: InputMaybe<Array<ChatWhereUniqueInput>>;
  set?: InputMaybe<Array<ChatWhereUniqueInput>>;
  update?: InputMaybe<Array<ChatUpdateWithWhereUniqueWithoutRoomInput>>;
  updateMany?: InputMaybe<Array<ChatUpdateManyWithWhereWithoutRoomInput>>;
  upsert?: InputMaybe<Array<ChatUpsertWithWhereUniqueWithoutRoomInput>>;
};

export type ChatUpdateManyWithoutTargetUserNestedInput = {
  connect?: InputMaybe<Array<ChatWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChatCreateOrConnectWithoutTargetUserInput>>;
  create?: InputMaybe<Array<ChatCreateWithoutTargetUserInput>>;
  createMany?: InputMaybe<ChatCreateManyTargetUserInputEnvelope>;
  delete?: InputMaybe<Array<ChatWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<ChatScalarWhereInput>>;
  disconnect?: InputMaybe<Array<ChatWhereUniqueInput>>;
  set?: InputMaybe<Array<ChatWhereUniqueInput>>;
  update?: InputMaybe<Array<ChatUpdateWithWhereUniqueWithoutTargetUserInput>>;
  updateMany?: InputMaybe<Array<ChatUpdateManyWithWhereWithoutTargetUserInput>>;
  upsert?: InputMaybe<Array<ChatUpsertWithWhereUniqueWithoutTargetUserInput>>;
};

export type ChatUpdateManyWithoutUserNestedInput = {
  connect?: InputMaybe<Array<ChatWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<ChatCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<ChatCreateWithoutUserInput>>;
  createMany?: InputMaybe<ChatCreateManyUserInputEnvelope>;
  delete?: InputMaybe<Array<ChatWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<ChatScalarWhereInput>>;
  disconnect?: InputMaybe<Array<ChatWhereUniqueInput>>;
  set?: InputMaybe<Array<ChatWhereUniqueInput>>;
  update?: InputMaybe<Array<ChatUpdateWithWhereUniqueWithoutUserInput>>;
  updateMany?: InputMaybe<Array<ChatUpdateManyWithWhereWithoutUserInput>>;
  upsert?: InputMaybe<Array<ChatUpsertWithWhereUniqueWithoutUserInput>>;
};

export type ChatUpdateWithWhereUniqueWithoutRoomInput = {
  data: ChatUpdateWithoutRoomInput;
  where: ChatWhereUniqueInput;
};

export type ChatUpdateWithWhereUniqueWithoutTargetUserInput = {
  data: ChatUpdateWithoutTargetUserInput;
  where: ChatWhereUniqueInput;
};

export type ChatUpdateWithWhereUniqueWithoutUserInput = {
  data: ChatUpdateWithoutUserInput;
  where: ChatWhereUniqueInput;
};

export type ChatUpdateWithoutRoomInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  message?: InputMaybe<Scalars['JSON']['input']>;
  plainText?: InputMaybe<StringFieldUpdateOperationsInput>;
  target?: InputMaybe<EnumChatTargetFieldUpdateOperationsInput>;
  targetUser?: InputMaybe<UserUpdateOneWithoutTargetChatsNestedInput>;
  type?: InputMaybe<EnumChatTypeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneWithoutFromChatsNestedInput>;
};

export type ChatUpdateWithoutTargetUserInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  message?: InputMaybe<Scalars['JSON']['input']>;
  plainText?: InputMaybe<StringFieldUpdateOperationsInput>;
  room?: InputMaybe<RoomUpdateOneWithoutChatsNestedInput>;
  target?: InputMaybe<EnumChatTargetFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumChatTypeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneWithoutFromChatsNestedInput>;
};

export type ChatUpdateWithoutUserInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  message?: InputMaybe<Scalars['JSON']['input']>;
  plainText?: InputMaybe<StringFieldUpdateOperationsInput>;
  room?: InputMaybe<RoomUpdateOneWithoutChatsNestedInput>;
  target?: InputMaybe<EnumChatTargetFieldUpdateOperationsInput>;
  targetUser?: InputMaybe<UserUpdateOneWithoutTargetChatsNestedInput>;
  type?: InputMaybe<EnumChatTypeFieldUpdateOperationsInput>;
};

export type ChatUpsertWithWhereUniqueWithoutRoomInput = {
  create: ChatCreateWithoutRoomInput;
  update: ChatUpdateWithoutRoomInput;
  where: ChatWhereUniqueInput;
};

export type ChatUpsertWithWhereUniqueWithoutTargetUserInput = {
  create: ChatCreateWithoutTargetUserInput;
  update: ChatUpdateWithoutTargetUserInput;
  where: ChatWhereUniqueInput;
};

export type ChatUpsertWithWhereUniqueWithoutUserInput = {
  create: ChatCreateWithoutUserInput;
  update: ChatUpdateWithoutUserInput;
  where: ChatWhereUniqueInput;
};

export type ChatWhereInput = {
  AND?: InputMaybe<Array<ChatWhereInput>>;
  NOT?: InputMaybe<Array<ChatWhereInput>>;
  OR?: InputMaybe<Array<ChatWhereInput>>;
  id?: InputMaybe<BigIntFilter>;
  message?: InputMaybe<JsonFilter>;
  plainText?: InputMaybe<StringFilter>;
  room?: InputMaybe<RoomNullableRelationFilter>;
  roomId?: InputMaybe<BigIntNullableFilter>;
  target?: InputMaybe<EnumChatTargetFilter>;
  targetUser?: InputMaybe<UserNullableRelationFilter>;
  targetUserId?: InputMaybe<BigIntNullableFilter>;
  type?: InputMaybe<EnumChatTypeFilter>;
  user?: InputMaybe<UserNullableRelationFilter>;
  userId?: InputMaybe<BigIntNullableFilter>;
};

export type ChatWhereUniqueInput = {
  AND?: InputMaybe<Array<ChatWhereInput>>;
  NOT?: InputMaybe<Array<ChatWhereInput>>;
  OR?: InputMaybe<Array<ChatWhereInput>>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  message?: InputMaybe<JsonFilter>;
  plainText?: InputMaybe<StringFilter>;
  room?: InputMaybe<RoomNullableRelationFilter>;
  roomId?: InputMaybe<BigIntNullableFilter>;
  target?: InputMaybe<EnumChatTargetFilter>;
  targetUser?: InputMaybe<UserNullableRelationFilter>;
  targetUserId?: InputMaybe<BigIntNullableFilter>;
  type?: InputMaybe<EnumChatTypeFilter>;
  user?: InputMaybe<UserNullableRelationFilter>;
  userId?: InputMaybe<BigIntNullableFilter>;
};

export type DateTimeFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type EnumChannelRolePermissionCodeFilter = {
  equals?: InputMaybe<ChannelRolePermissionCode>;
  in?: InputMaybe<Array<ChannelRolePermissionCode>>;
  not?: InputMaybe<NestedEnumChannelRolePermissionCodeFilter>;
  notIn?: InputMaybe<Array<ChannelRolePermissionCode>>;
};

export type EnumChatTargetFieldUpdateOperationsInput = {
  set?: InputMaybe<ChatTarget>;
};

export type EnumChatTargetFilter = {
  equals?: InputMaybe<ChatTarget>;
  in?: InputMaybe<Array<ChatTarget>>;
  not?: InputMaybe<NestedEnumChatTargetFilter>;
  notIn?: InputMaybe<Array<ChatTarget>>;
};

export type EnumChatTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<ChatType>;
};

export type EnumChatTypeFilter = {
  equals?: InputMaybe<ChatType>;
  in?: InputMaybe<Array<ChatType>>;
  not?: InputMaybe<NestedEnumChatTypeFilter>;
  notIn?: InputMaybe<Array<ChatType>>;
};

export type EnumUserTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<UserType>;
};

export type EnumUserTypeFilter = {
  equals?: InputMaybe<UserType>;
  in?: InputMaybe<Array<UserType>>;
  not?: InputMaybe<NestedEnumUserTypeFilter>;
  notIn?: InputMaybe<Array<UserType>>;
};

export type IntFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Int']['input']>;
  divide?: InputMaybe<Scalars['Int']['input']>;
  increment?: InputMaybe<Scalars['Int']['input']>;
  multiply?: InputMaybe<Scalars['Int']['input']>;
  set?: InputMaybe<Scalars['Int']['input']>;
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

export type JsonFilter = {
  array_contains?: InputMaybe<Scalars['JSON']['input']>;
  array_ends_with?: InputMaybe<Scalars['JSON']['input']>;
  array_starts_with?: InputMaybe<Scalars['JSON']['input']>;
  equals?: InputMaybe<Scalars['JSON']['input']>;
  gt?: InputMaybe<Scalars['JSON']['input']>;
  gte?: InputMaybe<Scalars['JSON']['input']>;
  lt?: InputMaybe<Scalars['JSON']['input']>;
  lte?: InputMaybe<Scalars['JSON']['input']>;
  not?: InputMaybe<Scalars['JSON']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  string_contains?: InputMaybe<Scalars['String']['input']>;
  string_ends_with?: InputMaybe<Scalars['String']['input']>;
  string_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  channelCreate: Channel;
  channelCreateInvite: ChannelInvite;
  channelExit: Scalars['Boolean']['output'];
  channelJoin: Channel;
  channelUpdate: Channel;
  /** 创建聊天消息 */
  createChatMessage: Chat;
  /** 删除聊天消息 */
  deleteChatMessage: Chat;
  roomCreate: Room;
  roomDelete: Room;
  roomUpdate: Room;
  userCreate: UserSession;
  userNicknameUpdate: User;
  userProfileUpdate: User;
  userSessionCreate: UserSession;
};


export type MutationChannelCreateArgs = {
  data: ChannelCreateInput;
};


export type MutationChannelCreateInviteArgs = {
  days?: Scalars['Int']['input'];
  id: Scalars['BigInt']['input'];
};


export type MutationChannelExitArgs = {
  id: Scalars['BigInt']['input'];
};


export type MutationChannelJoinArgs = {
  data: ChannelJoinInput;
};


export type MutationChannelUpdateArgs = {
  data: ChannelUpdateInput;
  where: ChannelWhereUniqueInput;
};


export type MutationCreateChatMessageArgs = {
  data: ChatCreateInput;
};


export type MutationDeleteChatMessageArgs = {
  where?: InputMaybe<ChatWhereInput>;
};


export type MutationRoomCreateArgs = {
  data: RoomCreateInput;
};


export type MutationRoomDeleteArgs = {
  roomId: Scalars['BigInt']['input'];
};


export type MutationRoomUpdateArgs = {
  data: RoomUpdateInput;
  roomId: Scalars['BigInt']['input'];
};


export type MutationUserCreateArgs = {
  data: UserCreateInput;
};


export type MutationUserNicknameUpdateArgs = {
  nickname: Scalars['String']['input'];
};


export type MutationUserProfileUpdateArgs = {
  data: UserProfileUpdateInput;
};


export type MutationUserSessionCreateArgs = {
  args: UserSessionCreateInput;
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

export type NestedBigIntNullableFilter = {
  equals?: InputMaybe<Scalars['BigInt']['input']>;
  gt?: InputMaybe<Scalars['BigInt']['input']>;
  gte?: InputMaybe<Scalars['BigInt']['input']>;
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lt?: InputMaybe<Scalars['BigInt']['input']>;
  lte?: InputMaybe<Scalars['BigInt']['input']>;
  not?: InputMaybe<NestedBigIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type NestedBoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type NestedDateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedEnumChannelRolePermissionCodeFilter = {
  equals?: InputMaybe<ChannelRolePermissionCode>;
  in?: InputMaybe<Array<ChannelRolePermissionCode>>;
  not?: InputMaybe<NestedEnumChannelRolePermissionCodeFilter>;
  notIn?: InputMaybe<Array<ChannelRolePermissionCode>>;
};

export type NestedEnumChatTargetFilter = {
  equals?: InputMaybe<ChatTarget>;
  in?: InputMaybe<Array<ChatTarget>>;
  not?: InputMaybe<NestedEnumChatTargetFilter>;
  notIn?: InputMaybe<Array<ChatTarget>>;
};

export type NestedEnumChatTypeFilter = {
  equals?: InputMaybe<ChatType>;
  in?: InputMaybe<Array<ChatType>>;
  not?: InputMaybe<NestedEnumChatTypeFilter>;
  notIn?: InputMaybe<Array<ChatType>>;
};

export type NestedEnumUserTypeFilter = {
  equals?: InputMaybe<UserType>;
  in?: InputMaybe<Array<UserType>>;
  not?: InputMaybe<NestedEnumUserTypeFilter>;
  notIn?: InputMaybe<Array<UserType>>;
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

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NullableDateTimeFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['DateTime']['input']>;
};

export type NullableStringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
};

export enum NullsOrder {
  First = 'first',
  Last = 'last'
}

export type Query = {
  __typename?: 'Query';
  channels: Array<Maybe<Channel>>;
  /** 查询消息 */
  chats: Array<Chat>;
  test: Scalars['BigInt']['output'];
  user?: Maybe<User>;
  /** 用户好友列表 */
  userFriends: Array<UserFriend>;
};


export type QueryChannelsArgs = {
  cursor?: InputMaybe<ChannelWhereUniqueInput>;
  distinct?: InputMaybe<Array<ChannelScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<ChannelOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ChannelWhereInput>;
};


export type QueryChatsArgs = {
  cursor?: InputMaybe<ChatWhereUniqueInput>;
  distinct?: InputMaybe<Array<ChatScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<ChatOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  target: ChatTarget;
  where?: InputMaybe<ChatWhereInput>;
};


export type QueryUserArgs = {
  where: UserWhereInput;
};

export type Room = {
  __typename?: 'Room';
  _count: RoomCount;
  /** 频道 */
  channel: Channel;
  /** 频道分组 */
  channelCategory: ChannelCategory;
  /** 频道分组ID */
  channelCategoryId: Scalars['BigInt']['output'];
  /** 频道ID */
  channelId: Scalars['BigInt']['output'];
  /** 房间对话 */
  chats?: Maybe<Array<Chat>>;
  createdTime: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  /** 最大成员数量 */
  maxMember: Scalars['Int']['output'];
  /** 房间名 */
  name: Scalars['String']['output'];
  /** 房间排序 */
  sort: Scalars['Int']['output'];
  updatedTime: Scalars['DateTime']['output'];
  users: Array<User>;
};

export type RoomAvgAggregate = {
  __typename?: 'RoomAvgAggregate';
  channelCategoryId?: Maybe<Scalars['Float']['output']>;
  channelId?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  maxMember?: Maybe<Scalars['Float']['output']>;
  sort?: Maybe<Scalars['Float']['output']>;
};

export type RoomCount = {
  __typename?: 'RoomCount';
  chats: Scalars['Int']['output'];
};

export type RoomCountAggregate = {
  __typename?: 'RoomCountAggregate';
  _all: Scalars['Int']['output'];
  channelCategoryId: Scalars['Int']['output'];
  channelId: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  maxMember: Scalars['Int']['output'];
  name: Scalars['Int']['output'];
  sort: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
};

export type RoomCreateInput = {
  /** 频道类目ID */
  channelCategoryId: Scalars['BigInt']['input'];
  /** 频道ID */
  channelId: Scalars['BigInt']['input'];
  /** 房间名 */
  name: Scalars['String']['input'];
};

export type RoomCreateManyChannelCategoryInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  maxMember?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
};

export type RoomCreateManyChannelCategoryInputEnvelope = {
  data: Array<RoomCreateManyChannelCategoryInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RoomCreateManyChannelInput = {
  channelCategoryId: Scalars['BigInt']['input'];
  id?: InputMaybe<Scalars['BigInt']['input']>;
  maxMember?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
};

export type RoomCreateManyChannelInputEnvelope = {
  data: Array<RoomCreateManyChannelInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RoomCreateNestedManyWithoutChannelCategoryInput = {
  connect?: InputMaybe<Array<RoomWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RoomCreateOrConnectWithoutChannelCategoryInput>>;
  create?: InputMaybe<Array<RoomCreateWithoutChannelCategoryInput>>;
  createMany?: InputMaybe<RoomCreateManyChannelCategoryInputEnvelope>;
};

export type RoomCreateNestedManyWithoutChannelInput = {
  connect?: InputMaybe<Array<RoomWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RoomCreateOrConnectWithoutChannelInput>>;
  create?: InputMaybe<Array<RoomCreateWithoutChannelInput>>;
  createMany?: InputMaybe<RoomCreateManyChannelInputEnvelope>;
};

export type RoomCreateNestedOneWithoutChatsInput = {
  connect?: InputMaybe<RoomWhereUniqueInput>;
  connectOrCreate?: InputMaybe<RoomCreateOrConnectWithoutChatsInput>;
  create?: InputMaybe<RoomCreateWithoutChatsInput>;
};

export type RoomCreateOrConnectWithoutChannelCategoryInput = {
  create: RoomCreateWithoutChannelCategoryInput;
  where: RoomWhereUniqueInput;
};

export type RoomCreateOrConnectWithoutChannelInput = {
  create: RoomCreateWithoutChannelInput;
  where: RoomWhereUniqueInput;
};

export type RoomCreateOrConnectWithoutChatsInput = {
  create: RoomCreateWithoutChatsInput;
  where: RoomWhereUniqueInput;
};

export type RoomCreateWithoutChannelCategoryInput = {
  chats?: InputMaybe<ChatCreateNestedManyWithoutRoomInput>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  maxMember?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
};

export type RoomCreateWithoutChannelInput = {
  channelCategory: ChannelCategoryCreateNestedOneWithoutRoomsInput;
  chats?: InputMaybe<ChatCreateNestedManyWithoutRoomInput>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  maxMember?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
};

export type RoomCreateWithoutChatsInput = {
  channelCategory: ChannelCategoryCreateNestedOneWithoutRoomsInput;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  maxMember?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
};

export type RoomListRelationFilter = {
  every?: InputMaybe<RoomWhereInput>;
  none?: InputMaybe<RoomWhereInput>;
  some?: InputMaybe<RoomWhereInput>;
};

export type RoomMaxAggregate = {
  __typename?: 'RoomMaxAggregate';
  channelCategoryId?: Maybe<Scalars['BigInt']['output']>;
  channelId?: Maybe<Scalars['BigInt']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  maxMember?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sort?: Maybe<Scalars['Int']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type RoomMinAggregate = {
  __typename?: 'RoomMinAggregate';
  channelCategoryId?: Maybe<Scalars['BigInt']['output']>;
  channelId?: Maybe<Scalars['BigInt']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  maxMember?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sort?: Maybe<Scalars['Int']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type RoomNullableRelationFilter = {
  is?: InputMaybe<RoomWhereInput>;
  isNot?: InputMaybe<RoomWhereInput>;
};

export type RoomOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type RoomOrderByWithRelationInput = {
  channelCategory?: InputMaybe<ChannelCategoryOrderByWithRelationInput>;
  channelCategoryId?: InputMaybe<SortOrder>;
  chats?: InputMaybe<ChatOrderByRelationAggregateInput>;
  id?: InputMaybe<SortOrder>;
  maxMember?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sort?: InputMaybe<SortOrder>;
};

export type RoomScalarWhereInput = {
  AND?: InputMaybe<Array<RoomScalarWhereInput>>;
  NOT?: InputMaybe<Array<RoomScalarWhereInput>>;
  OR?: InputMaybe<Array<RoomScalarWhereInput>>;
  channelCategoryId?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  maxMember?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sort?: InputMaybe<IntFilter>;
};

export type RoomSumAggregate = {
  __typename?: 'RoomSumAggregate';
  channelCategoryId?: Maybe<Scalars['BigInt']['output']>;
  channelId?: Maybe<Scalars['BigInt']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  maxMember?: Maybe<Scalars['Int']['output']>;
  sort?: Maybe<Scalars['Int']['output']>;
};

export type RoomUpdateInput = {
  channelCategory?: InputMaybe<ChannelCategoryUpdateOneRequiredWithoutRoomsNestedInput>;
  chats?: InputMaybe<ChatUpdateManyWithoutRoomNestedInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  maxMember?: InputMaybe<IntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  sort?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type RoomUpdateManyMutationInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  maxMember?: InputMaybe<IntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  sort?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type RoomUpdateManyWithWhereWithoutChannelCategoryInput = {
  data: RoomUpdateManyMutationInput;
  where: RoomScalarWhereInput;
};

export type RoomUpdateManyWithWhereWithoutChannelInput = {
  data: RoomUpdateManyMutationInput;
  where: RoomScalarWhereInput;
};

export type RoomUpdateManyWithoutChannelCategoryNestedInput = {
  connect?: InputMaybe<Array<RoomWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RoomCreateOrConnectWithoutChannelCategoryInput>>;
  create?: InputMaybe<Array<RoomCreateWithoutChannelCategoryInput>>;
  createMany?: InputMaybe<RoomCreateManyChannelCategoryInputEnvelope>;
  delete?: InputMaybe<Array<RoomWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<RoomScalarWhereInput>>;
  disconnect?: InputMaybe<Array<RoomWhereUniqueInput>>;
  set?: InputMaybe<Array<RoomWhereUniqueInput>>;
  update?: InputMaybe<Array<RoomUpdateWithWhereUniqueWithoutChannelCategoryInput>>;
  updateMany?: InputMaybe<Array<RoomUpdateManyWithWhereWithoutChannelCategoryInput>>;
  upsert?: InputMaybe<Array<RoomUpsertWithWhereUniqueWithoutChannelCategoryInput>>;
};

export type RoomUpdateManyWithoutChannelNestedInput = {
  connect?: InputMaybe<Array<RoomWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RoomCreateOrConnectWithoutChannelInput>>;
  create?: InputMaybe<Array<RoomCreateWithoutChannelInput>>;
  createMany?: InputMaybe<RoomCreateManyChannelInputEnvelope>;
  delete?: InputMaybe<Array<RoomWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<RoomScalarWhereInput>>;
  disconnect?: InputMaybe<Array<RoomWhereUniqueInput>>;
  set?: InputMaybe<Array<RoomWhereUniqueInput>>;
  update?: InputMaybe<Array<RoomUpdateWithWhereUniqueWithoutChannelInput>>;
  updateMany?: InputMaybe<Array<RoomUpdateManyWithWhereWithoutChannelInput>>;
  upsert?: InputMaybe<Array<RoomUpsertWithWhereUniqueWithoutChannelInput>>;
};

export type RoomUpdateOneWithoutChatsNestedInput = {
  connect?: InputMaybe<RoomWhereUniqueInput>;
  connectOrCreate?: InputMaybe<RoomCreateOrConnectWithoutChatsInput>;
  create?: InputMaybe<RoomCreateWithoutChatsInput>;
  delete?: InputMaybe<RoomWhereInput>;
  disconnect?: InputMaybe<RoomWhereInput>;
  update?: InputMaybe<RoomUpdateToOneWithWhereWithoutChatsInput>;
  upsert?: InputMaybe<RoomUpsertWithoutChatsInput>;
};

export type RoomUpdateToOneWithWhereWithoutChatsInput = {
  data: RoomUpdateWithoutChatsInput;
  where?: InputMaybe<RoomWhereInput>;
};

export type RoomUpdateWithWhereUniqueWithoutChannelCategoryInput = {
  data: RoomUpdateWithoutChannelCategoryInput;
  where: RoomWhereUniqueInput;
};

export type RoomUpdateWithWhereUniqueWithoutChannelInput = {
  data: RoomUpdateWithoutChannelInput;
  where: RoomWhereUniqueInput;
};

export type RoomUpdateWithoutChannelCategoryInput = {
  chats?: InputMaybe<ChatUpdateManyWithoutRoomNestedInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  maxMember?: InputMaybe<IntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  sort?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type RoomUpdateWithoutChannelInput = {
  channelCategory?: InputMaybe<ChannelCategoryUpdateOneRequiredWithoutRoomsNestedInput>;
  chats?: InputMaybe<ChatUpdateManyWithoutRoomNestedInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  maxMember?: InputMaybe<IntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  sort?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type RoomUpdateWithoutChatsInput = {
  channelCategory?: InputMaybe<ChannelCategoryUpdateOneRequiredWithoutRoomsNestedInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  maxMember?: InputMaybe<IntFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  sort?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type RoomUpsertWithWhereUniqueWithoutChannelCategoryInput = {
  create: RoomCreateWithoutChannelCategoryInput;
  update: RoomUpdateWithoutChannelCategoryInput;
  where: RoomWhereUniqueInput;
};

export type RoomUpsertWithWhereUniqueWithoutChannelInput = {
  create: RoomCreateWithoutChannelInput;
  update: RoomUpdateWithoutChannelInput;
  where: RoomWhereUniqueInput;
};

export type RoomUpsertWithoutChatsInput = {
  create: RoomCreateWithoutChatsInput;
  update: RoomUpdateWithoutChatsInput;
  where?: InputMaybe<RoomWhereInput>;
};

export type RoomWhereInput = {
  AND?: InputMaybe<Array<RoomWhereInput>>;
  NOT?: InputMaybe<Array<RoomWhereInput>>;
  OR?: InputMaybe<Array<RoomWhereInput>>;
  channelCategory?: InputMaybe<ChannelCategoryRelationFilter>;
  channelCategoryId?: InputMaybe<BigIntFilter>;
  chats?: InputMaybe<ChatListRelationFilter>;
  id?: InputMaybe<BigIntFilter>;
  maxMember?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sort?: InputMaybe<IntFilter>;
};

export type RoomWhereUniqueInput = {
  AND?: InputMaybe<Array<RoomWhereInput>>;
  NOT?: InputMaybe<Array<RoomWhereInput>>;
  OR?: InputMaybe<Array<RoomWhereInput>>;
  channelCategory?: InputMaybe<ChannelCategoryRelationFilter>;
  channelCategoryId?: InputMaybe<BigIntFilter>;
  chats?: InputMaybe<ChatListRelationFilter>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  maxMember?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sort?: InputMaybe<IntFilter>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type SortOrderInput = {
  nulls?: InputMaybe<NullsOrder>;
  sort: SortOrder;
};

export type StringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
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

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** 用户表 */
export type User = {
  __typename?: 'User';
  ChannelInvite?: Maybe<Array<ChannelInvite>>;
  _count: UserCount;
  /** 头像 */
  avatar?: Maybe<Scalars['String']['output']>;
  /** 加入的频道 */
  channels?: Maybe<Array<ChannelToUser>>;
  createdTime: Scalars['DateTime']['output'];
  friendsA?: Maybe<Array<UserFriend>>;
  friendsB?: Maybe<Array<UserFriend>>;
  fromChats?: Maybe<Array<Chat>>;
  id: Scalars['BigInt']['output'];
  /** 个人介绍 */
  intro: Scalars['String']['output'];
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
  /** 资料横幅 */
  profileBanner?: Maybe<Scalars['String']['output']>;
  /** 在线状态 */
  sessionState: UserSessionState;
  targetChats?: Maybe<Array<Chat>>;
  /** 用户类型 */
  type: UserType;
  /** 未读私信 */
  unreadMessage: Scalars['Int']['output'];
  updatedTime: Scalars['DateTime']['output'];
  /** 用户名 */
  username: Scalars['String']['output'];
};

export type UserAvgAggregate = {
  __typename?: 'UserAvgAggregate';
  id?: Maybe<Scalars['Float']['output']>;
  nicknameNo?: Maybe<Scalars['Float']['output']>;
  unreadMessage?: Maybe<Scalars['Float']['output']>;
};

export type UserCount = {
  __typename?: 'UserCount';
  ChannelInvite: Scalars['Int']['output'];
  channels: Scalars['Int']['output'];
  friendsA: Scalars['Int']['output'];
  friendsB: Scalars['Int']['output'];
  fromChats: Scalars['Int']['output'];
  ownedChannels: Scalars['Int']['output'];
  targetChats: Scalars['Int']['output'];
};

export type UserCountAggregate = {
  __typename?: 'UserCountAggregate';
  _all: Scalars['Int']['output'];
  avatar: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  intro: Scalars['Int']['output'];
  nickname: Scalars['Int']['output'];
  nicknameNo: Scalars['Int']['output'];
  password: Scalars['Int']['output'];
  passwordSalt: Scalars['Int']['output'];
  profileBanner: Scalars['Int']['output'];
  sessionState: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  unreadMessage: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
  username: Scalars['Int']['output'];
};

export type UserCreateInput = {
  ChannelInvite?: InputMaybe<ChannelInviteCreateNestedManyWithoutUserInput>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  friendsA?: InputMaybe<UserFriendCreateNestedManyWithoutUserAInput>;
  friendsB?: InputMaybe<UserFriendCreateNestedManyWithoutUserBInput>;
  fromChats?: InputMaybe<ChatCreateNestedManyWithoutUserInput>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  intro?: InputMaybe<Scalars['String']['input']>;
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profileBanner?: InputMaybe<Scalars['String']['input']>;
  targetChats?: InputMaybe<ChatCreateNestedManyWithoutTargetUserInput>;
  type?: InputMaybe<UserType>;
  unreadMessage?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};

export type UserCreateNestedOneWithoutFriendsAInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutFriendsAInput>;
  create?: InputMaybe<UserCreateWithoutFriendsAInput>;
};

export type UserCreateNestedOneWithoutFriendsBInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutFriendsBInput>;
  create?: InputMaybe<UserCreateWithoutFriendsBInput>;
};

export type UserCreateNestedOneWithoutFromChatsInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutFromChatsInput>;
  create?: InputMaybe<UserCreateWithoutFromChatsInput>;
};

export type UserCreateNestedOneWithoutTargetChatsInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutTargetChatsInput>;
  create?: InputMaybe<UserCreateWithoutTargetChatsInput>;
};

export type UserCreateOrConnectWithoutFriendsAInput = {
  create: UserCreateWithoutFriendsAInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutFriendsBInput = {
  create: UserCreateWithoutFriendsBInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutFromChatsInput = {
  create: UserCreateWithoutFromChatsInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutTargetChatsInput = {
  create: UserCreateWithoutTargetChatsInput;
  where: UserWhereUniqueInput;
};

export type UserCreateWithoutFriendsAInput = {
  ChannelInvite?: InputMaybe<ChannelInviteCreateNestedManyWithoutUserInput>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  friendsB?: InputMaybe<UserFriendCreateNestedManyWithoutUserBInput>;
  fromChats?: InputMaybe<ChatCreateNestedManyWithoutUserInput>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  intro?: InputMaybe<Scalars['String']['input']>;
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profileBanner?: InputMaybe<Scalars['String']['input']>;
  targetChats?: InputMaybe<ChatCreateNestedManyWithoutTargetUserInput>;
  type?: InputMaybe<UserType>;
  unreadMessage?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};

export type UserCreateWithoutFriendsBInput = {
  ChannelInvite?: InputMaybe<ChannelInviteCreateNestedManyWithoutUserInput>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  friendsA?: InputMaybe<UserFriendCreateNestedManyWithoutUserAInput>;
  fromChats?: InputMaybe<ChatCreateNestedManyWithoutUserInput>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  intro?: InputMaybe<Scalars['String']['input']>;
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profileBanner?: InputMaybe<Scalars['String']['input']>;
  targetChats?: InputMaybe<ChatCreateNestedManyWithoutTargetUserInput>;
  type?: InputMaybe<UserType>;
  unreadMessage?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};

export type UserCreateWithoutFromChatsInput = {
  ChannelInvite?: InputMaybe<ChannelInviteCreateNestedManyWithoutUserInput>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  friendsA?: InputMaybe<UserFriendCreateNestedManyWithoutUserAInput>;
  friendsB?: InputMaybe<UserFriendCreateNestedManyWithoutUserBInput>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  intro?: InputMaybe<Scalars['String']['input']>;
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profileBanner?: InputMaybe<Scalars['String']['input']>;
  targetChats?: InputMaybe<ChatCreateNestedManyWithoutTargetUserInput>;
  type?: InputMaybe<UserType>;
  unreadMessage?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};

export type UserCreateWithoutTargetChatsInput = {
  ChannelInvite?: InputMaybe<ChannelInviteCreateNestedManyWithoutUserInput>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  friendsA?: InputMaybe<UserFriendCreateNestedManyWithoutUserAInput>;
  friendsB?: InputMaybe<UserFriendCreateNestedManyWithoutUserBInput>;
  fromChats?: InputMaybe<ChatCreateNestedManyWithoutUserInput>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  intro?: InputMaybe<Scalars['String']['input']>;
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profileBanner?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<UserType>;
  unreadMessage?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};

export type UserFriend = {
  __typename?: 'UserFriend';
  createdTime: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  /** 最后聊天时间 */
  lastChatTime: Scalars['DateTime']['output'];
  updatedTime: Scalars['DateTime']['output'];
  userA: User;
  /** 用户A是否同意 */
  userAAccept: Scalars['Boolean']['output'];
  userAId: Scalars['BigInt']['output'];
  /** 用户A未读消息 */
  userAUnread: Scalars['Int']['output'];
  userB: User;
  /** 用户B是否同意 */
  userBAccept: Scalars['Boolean']['output'];
  userBId: Scalars['BigInt']['output'];
  /** 用户B未读消息 */
  userBUnread: Scalars['Int']['output'];
};

export type UserFriendAvgAggregate = {
  __typename?: 'UserFriendAvgAggregate';
  id?: Maybe<Scalars['Float']['output']>;
  userAId?: Maybe<Scalars['Float']['output']>;
  userAUnread?: Maybe<Scalars['Float']['output']>;
  userBId?: Maybe<Scalars['Float']['output']>;
  userBUnread?: Maybe<Scalars['Float']['output']>;
};

export type UserFriendCountAggregate = {
  __typename?: 'UserFriendCountAggregate';
  _all: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  lastChatTime: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
  userAAccept: Scalars['Int']['output'];
  userAId: Scalars['Int']['output'];
  userAUnread: Scalars['Int']['output'];
  userBAccept: Scalars['Int']['output'];
  userBId: Scalars['Int']['output'];
  userBUnread: Scalars['Int']['output'];
};

export type UserFriendCreateManyUserAInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  lastChatTime?: InputMaybe<Scalars['DateTime']['input']>;
  userAAccept?: InputMaybe<Scalars['Boolean']['input']>;
  userAUnread?: InputMaybe<Scalars['Int']['input']>;
  userBAccept?: InputMaybe<Scalars['Boolean']['input']>;
  userBId: Scalars['BigInt']['input'];
  userBUnread?: InputMaybe<Scalars['Int']['input']>;
};

export type UserFriendCreateManyUserAInputEnvelope = {
  data: Array<UserFriendCreateManyUserAInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserFriendCreateManyUserBInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  lastChatTime?: InputMaybe<Scalars['DateTime']['input']>;
  userAAccept?: InputMaybe<Scalars['Boolean']['input']>;
  userAId: Scalars['BigInt']['input'];
  userAUnread?: InputMaybe<Scalars['Int']['input']>;
  userBAccept?: InputMaybe<Scalars['Boolean']['input']>;
  userBUnread?: InputMaybe<Scalars['Int']['input']>;
};

export type UserFriendCreateManyUserBInputEnvelope = {
  data: Array<UserFriendCreateManyUserBInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserFriendCreateNestedManyWithoutUserAInput = {
  connect?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserFriendCreateOrConnectWithoutUserAInput>>;
  create?: InputMaybe<Array<UserFriendCreateWithoutUserAInput>>;
  createMany?: InputMaybe<UserFriendCreateManyUserAInputEnvelope>;
};

export type UserFriendCreateNestedManyWithoutUserBInput = {
  connect?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserFriendCreateOrConnectWithoutUserBInput>>;
  create?: InputMaybe<Array<UserFriendCreateWithoutUserBInput>>;
  createMany?: InputMaybe<UserFriendCreateManyUserBInputEnvelope>;
};

export type UserFriendCreateOrConnectWithoutUserAInput = {
  create: UserFriendCreateWithoutUserAInput;
  where: UserFriendWhereUniqueInput;
};

export type UserFriendCreateOrConnectWithoutUserBInput = {
  create: UserFriendCreateWithoutUserBInput;
  where: UserFriendWhereUniqueInput;
};

export type UserFriendCreateWithoutUserAInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  lastChatTime?: InputMaybe<Scalars['DateTime']['input']>;
  userAAccept?: InputMaybe<Scalars['Boolean']['input']>;
  userAUnread?: InputMaybe<Scalars['Int']['input']>;
  userB: UserCreateNestedOneWithoutFriendsBInput;
  userBAccept?: InputMaybe<Scalars['Boolean']['input']>;
  userBUnread?: InputMaybe<Scalars['Int']['input']>;
};

export type UserFriendCreateWithoutUserBInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  lastChatTime?: InputMaybe<Scalars['DateTime']['input']>;
  userA: UserCreateNestedOneWithoutFriendsAInput;
  userAAccept?: InputMaybe<Scalars['Boolean']['input']>;
  userAUnread?: InputMaybe<Scalars['Int']['input']>;
  userBAccept?: InputMaybe<Scalars['Boolean']['input']>;
  userBUnread?: InputMaybe<Scalars['Int']['input']>;
};

export type UserFriendListRelationFilter = {
  every?: InputMaybe<UserFriendWhereInput>;
  none?: InputMaybe<UserFriendWhereInput>;
  some?: InputMaybe<UserFriendWhereInput>;
};

export type UserFriendMaxAggregate = {
  __typename?: 'UserFriendMaxAggregate';
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  lastChatTime?: Maybe<Scalars['DateTime']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
  userAAccept?: Maybe<Scalars['Boolean']['output']>;
  userAId?: Maybe<Scalars['BigInt']['output']>;
  userAUnread?: Maybe<Scalars['Int']['output']>;
  userBAccept?: Maybe<Scalars['Boolean']['output']>;
  userBId?: Maybe<Scalars['BigInt']['output']>;
  userBUnread?: Maybe<Scalars['Int']['output']>;
};

export type UserFriendMinAggregate = {
  __typename?: 'UserFriendMinAggregate';
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  lastChatTime?: Maybe<Scalars['DateTime']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
  userAAccept?: Maybe<Scalars['Boolean']['output']>;
  userAId?: Maybe<Scalars['BigInt']['output']>;
  userAUnread?: Maybe<Scalars['Int']['output']>;
  userBAccept?: Maybe<Scalars['Boolean']['output']>;
  userBId?: Maybe<Scalars['BigInt']['output']>;
  userBUnread?: Maybe<Scalars['Int']['output']>;
};

export type UserFriendOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type UserFriendScalarWhereInput = {
  AND?: InputMaybe<Array<UserFriendScalarWhereInput>>;
  NOT?: InputMaybe<Array<UserFriendScalarWhereInput>>;
  OR?: InputMaybe<Array<UserFriendScalarWhereInput>>;
  id?: InputMaybe<BigIntFilter>;
  lastChatTime?: InputMaybe<DateTimeFilter>;
  userAAccept?: InputMaybe<BoolFilter>;
  userAId?: InputMaybe<BigIntFilter>;
  userAUnread?: InputMaybe<IntFilter>;
  userBAccept?: InputMaybe<BoolFilter>;
  userBId?: InputMaybe<BigIntFilter>;
  userBUnread?: InputMaybe<IntFilter>;
};

export type UserFriendSumAggregate = {
  __typename?: 'UserFriendSumAggregate';
  id?: Maybe<Scalars['BigInt']['output']>;
  userAId?: Maybe<Scalars['BigInt']['output']>;
  userAUnread?: Maybe<Scalars['Int']['output']>;
  userBId?: Maybe<Scalars['BigInt']['output']>;
  userBUnread?: Maybe<Scalars['Int']['output']>;
};

export type UserFriendUpdateManyMutationInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  lastChatTime?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  userAAccept?: InputMaybe<BoolFieldUpdateOperationsInput>;
  userAUnread?: InputMaybe<IntFieldUpdateOperationsInput>;
  userBAccept?: InputMaybe<BoolFieldUpdateOperationsInput>;
  userBUnread?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type UserFriendUpdateManyWithWhereWithoutUserAInput = {
  data: UserFriendUpdateManyMutationInput;
  where: UserFriendScalarWhereInput;
};

export type UserFriendUpdateManyWithWhereWithoutUserBInput = {
  data: UserFriendUpdateManyMutationInput;
  where: UserFriendScalarWhereInput;
};

export type UserFriendUpdateManyWithoutUserANestedInput = {
  connect?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserFriendCreateOrConnectWithoutUserAInput>>;
  create?: InputMaybe<Array<UserFriendCreateWithoutUserAInput>>;
  createMany?: InputMaybe<UserFriendCreateManyUserAInputEnvelope>;
  delete?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<UserFriendScalarWhereInput>>;
  disconnect?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  set?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  update?: InputMaybe<Array<UserFriendUpdateWithWhereUniqueWithoutUserAInput>>;
  updateMany?: InputMaybe<Array<UserFriendUpdateManyWithWhereWithoutUserAInput>>;
  upsert?: InputMaybe<Array<UserFriendUpsertWithWhereUniqueWithoutUserAInput>>;
};

export type UserFriendUpdateManyWithoutUserBNestedInput = {
  connect?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserFriendCreateOrConnectWithoutUserBInput>>;
  create?: InputMaybe<Array<UserFriendCreateWithoutUserBInput>>;
  createMany?: InputMaybe<UserFriendCreateManyUserBInputEnvelope>;
  delete?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<UserFriendScalarWhereInput>>;
  disconnect?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  set?: InputMaybe<Array<UserFriendWhereUniqueInput>>;
  update?: InputMaybe<Array<UserFriendUpdateWithWhereUniqueWithoutUserBInput>>;
  updateMany?: InputMaybe<Array<UserFriendUpdateManyWithWhereWithoutUserBInput>>;
  upsert?: InputMaybe<Array<UserFriendUpsertWithWhereUniqueWithoutUserBInput>>;
};

export type UserFriendUpdateWithWhereUniqueWithoutUserAInput = {
  data: UserFriendUpdateWithoutUserAInput;
  where: UserFriendWhereUniqueInput;
};

export type UserFriendUpdateWithWhereUniqueWithoutUserBInput = {
  data: UserFriendUpdateWithoutUserBInput;
  where: UserFriendWhereUniqueInput;
};

export type UserFriendUpdateWithoutUserAInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  lastChatTime?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  userAAccept?: InputMaybe<BoolFieldUpdateOperationsInput>;
  userAUnread?: InputMaybe<IntFieldUpdateOperationsInput>;
  userB?: InputMaybe<UserUpdateOneRequiredWithoutFriendsBNestedInput>;
  userBAccept?: InputMaybe<BoolFieldUpdateOperationsInput>;
  userBUnread?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type UserFriendUpdateWithoutUserBInput = {
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  lastChatTime?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  userA?: InputMaybe<UserUpdateOneRequiredWithoutFriendsANestedInput>;
  userAAccept?: InputMaybe<BoolFieldUpdateOperationsInput>;
  userAUnread?: InputMaybe<IntFieldUpdateOperationsInput>;
  userBAccept?: InputMaybe<BoolFieldUpdateOperationsInput>;
  userBUnread?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type UserFriendUpsertWithWhereUniqueWithoutUserAInput = {
  create: UserFriendCreateWithoutUserAInput;
  update: UserFriendUpdateWithoutUserAInput;
  where: UserFriendWhereUniqueInput;
};

export type UserFriendUpsertWithWhereUniqueWithoutUserBInput = {
  create: UserFriendCreateWithoutUserBInput;
  update: UserFriendUpdateWithoutUserBInput;
  where: UserFriendWhereUniqueInput;
};

export type UserFriendUserAIdUserBIdCompoundUniqueInput = {
  userAId: Scalars['BigInt']['input'];
  userBId: Scalars['BigInt']['input'];
};

export type UserFriendWhereInput = {
  AND?: InputMaybe<Array<UserFriendWhereInput>>;
  NOT?: InputMaybe<Array<UserFriendWhereInput>>;
  OR?: InputMaybe<Array<UserFriendWhereInput>>;
  id?: InputMaybe<BigIntFilter>;
  lastChatTime?: InputMaybe<DateTimeFilter>;
  userA?: InputMaybe<UserRelationFilter>;
  userAAccept?: InputMaybe<BoolFilter>;
  userAId?: InputMaybe<BigIntFilter>;
  userAUnread?: InputMaybe<IntFilter>;
  userB?: InputMaybe<UserRelationFilter>;
  userBAccept?: InputMaybe<BoolFilter>;
  userBId?: InputMaybe<BigIntFilter>;
  userBUnread?: InputMaybe<IntFilter>;
};

export type UserFriendWhereUniqueInput = {
  AND?: InputMaybe<Array<UserFriendWhereInput>>;
  NOT?: InputMaybe<Array<UserFriendWhereInput>>;
  OR?: InputMaybe<Array<UserFriendWhereInput>>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  lastChatTime?: InputMaybe<DateTimeFilter>;
  userA?: InputMaybe<UserRelationFilter>;
  userAAccept?: InputMaybe<BoolFilter>;
  userAId?: InputMaybe<BigIntFilter>;
  userAId_userBId?: InputMaybe<UserFriendUserAIdUserBIdCompoundUniqueInput>;
  userAUnread?: InputMaybe<IntFilter>;
  userB?: InputMaybe<UserRelationFilter>;
  userBAccept?: InputMaybe<BoolFilter>;
  userBId?: InputMaybe<BigIntFilter>;
  userBUnread?: InputMaybe<IntFilter>;
};

export type UserMaxAggregate = {
  __typename?: 'UserMaxAggregate';
  avatar?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  intro?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  nicknameNo?: Maybe<Scalars['Int']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  passwordSalt?: Maybe<Scalars['String']['output']>;
  profileBanner?: Maybe<Scalars['String']['output']>;
  sessionState?: Maybe<UserSessionState>;
  type?: Maybe<UserType>;
  unreadMessage?: Maybe<Scalars['Int']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserMinAggregate = {
  __typename?: 'UserMinAggregate';
  avatar?: Maybe<Scalars['String']['output']>;
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  intro?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  nicknameNo?: Maybe<Scalars['Int']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  passwordSalt?: Maybe<Scalars['String']['output']>;
  profileBanner?: Maybe<Scalars['String']['output']>;
  sessionState?: Maybe<UserSessionState>;
  type?: Maybe<UserType>;
  unreadMessage?: Maybe<Scalars['Int']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserNicknameAvgAggregate = {
  __typename?: 'UserNicknameAvgAggregate';
  id?: Maybe<Scalars['Float']['output']>;
  no?: Maybe<Scalars['Float']['output']>;
};

export type UserNicknameCountAggregate = {
  __typename?: 'UserNicknameCountAggregate';
  _all: Scalars['Int']['output'];
  createdTime: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  nickname: Scalars['Int']['output'];
  no: Scalars['Int']['output'];
  updatedTime: Scalars['Int']['output'];
};

export type UserNicknameMaxAggregate = {
  __typename?: 'UserNicknameMaxAggregate';
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  no?: Maybe<Scalars['Int']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type UserNicknameMinAggregate = {
  __typename?: 'UserNicknameMinAggregate';
  createdTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['BigInt']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  no?: Maybe<Scalars['Int']['output']>;
  updatedTime?: Maybe<Scalars['DateTime']['output']>;
};

export type UserNicknameSumAggregate = {
  __typename?: 'UserNicknameSumAggregate';
  id?: Maybe<Scalars['BigInt']['output']>;
  no?: Maybe<Scalars['Int']['output']>;
};

export type UserNullableRelationFilter = {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
};

export type UserOrderByWithRelationInput = {
  ChannelInvite?: InputMaybe<ChannelInviteOrderByRelationAggregateInput>;
  avatar?: InputMaybe<SortOrderInput>;
  friendsA?: InputMaybe<UserFriendOrderByRelationAggregateInput>;
  friendsB?: InputMaybe<UserFriendOrderByRelationAggregateInput>;
  fromChats?: InputMaybe<ChatOrderByRelationAggregateInput>;
  id?: InputMaybe<SortOrder>;
  intro?: InputMaybe<SortOrder>;
  nickname?: InputMaybe<SortOrder>;
  nicknameNo?: InputMaybe<SortOrder>;
  password?: InputMaybe<SortOrder>;
  profileBanner?: InputMaybe<SortOrderInput>;
  targetChats?: InputMaybe<ChatOrderByRelationAggregateInput>;
  type?: InputMaybe<SortOrder>;
  unreadMessage?: InputMaybe<SortOrder>;
  username?: InputMaybe<SortOrder>;
};

/** 用户资料更新入参 */
export type UserProfileUpdateInput = {
  /** 头像 */
  avatar?: InputMaybe<Scalars['String']['input']>;
  /** 个人介绍 */
  intro?: InputMaybe<Scalars['String']['input']>;
  /** 资料横幅 */
  profileBanner?: InputMaybe<Scalars['String']['input']>;
};

export type UserRelationFilter = {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
};

export type UserSession = {
  __typename?: 'UserSession';
  sessionToken: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['BigInt']['output'];
};

export type UserSessionCreateInput = {
  account: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum UserSessionState {
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

export type UserSumAggregate = {
  __typename?: 'UserSumAggregate';
  id?: Maybe<Scalars['BigInt']['output']>;
  nicknameNo?: Maybe<Scalars['Int']['output']>;
  unreadMessage?: Maybe<Scalars['Int']['output']>;
};

export enum UserType {
  Admin = 'ADMIN',
  System = 'SYSTEM',
  User = 'USER'
}

export type UserUpdateOneRequiredWithoutFriendsANestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutFriendsAInput>;
  create?: InputMaybe<UserCreateWithoutFriendsAInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutFriendsAInput>;
  upsert?: InputMaybe<UserUpsertWithoutFriendsAInput>;
};

export type UserUpdateOneRequiredWithoutFriendsBNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutFriendsBInput>;
  create?: InputMaybe<UserCreateWithoutFriendsBInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutFriendsBInput>;
  upsert?: InputMaybe<UserUpsertWithoutFriendsBInput>;
};

export type UserUpdateOneWithoutFromChatsNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutFromChatsInput>;
  create?: InputMaybe<UserCreateWithoutFromChatsInput>;
  delete?: InputMaybe<UserWhereInput>;
  disconnect?: InputMaybe<UserWhereInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutFromChatsInput>;
  upsert?: InputMaybe<UserUpsertWithoutFromChatsInput>;
};

export type UserUpdateOneWithoutTargetChatsNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutTargetChatsInput>;
  create?: InputMaybe<UserCreateWithoutTargetChatsInput>;
  delete?: InputMaybe<UserWhereInput>;
  disconnect?: InputMaybe<UserWhereInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutTargetChatsInput>;
  upsert?: InputMaybe<UserUpsertWithoutTargetChatsInput>;
};

export type UserUpdateToOneWithWhereWithoutFriendsAInput = {
  data: UserUpdateWithoutFriendsAInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateToOneWithWhereWithoutFriendsBInput = {
  data: UserUpdateWithoutFriendsBInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateToOneWithWhereWithoutFromChatsInput = {
  data: UserUpdateWithoutFromChatsInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateToOneWithWhereWithoutTargetChatsInput = {
  data: UserUpdateWithoutTargetChatsInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateWithoutFriendsAInput = {
  ChannelInvite?: InputMaybe<ChannelInviteUpdateManyWithoutUserNestedInput>;
  avatar?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  friendsB?: InputMaybe<UserFriendUpdateManyWithoutUserBNestedInput>;
  fromChats?: InputMaybe<ChatUpdateManyWithoutUserNestedInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  intro?: InputMaybe<StringFieldUpdateOperationsInput>;
  nickname?: InputMaybe<StringFieldUpdateOperationsInput>;
  password?: InputMaybe<StringFieldUpdateOperationsInput>;
  profileBanner?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  targetChats?: InputMaybe<ChatUpdateManyWithoutTargetUserNestedInput>;
  type?: InputMaybe<EnumUserTypeFieldUpdateOperationsInput>;
  unreadMessage?: InputMaybe<IntFieldUpdateOperationsInput>;
  username?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutFriendsBInput = {
  ChannelInvite?: InputMaybe<ChannelInviteUpdateManyWithoutUserNestedInput>;
  avatar?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  friendsA?: InputMaybe<UserFriendUpdateManyWithoutUserANestedInput>;
  fromChats?: InputMaybe<ChatUpdateManyWithoutUserNestedInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  intro?: InputMaybe<StringFieldUpdateOperationsInput>;
  nickname?: InputMaybe<StringFieldUpdateOperationsInput>;
  password?: InputMaybe<StringFieldUpdateOperationsInput>;
  profileBanner?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  targetChats?: InputMaybe<ChatUpdateManyWithoutTargetUserNestedInput>;
  type?: InputMaybe<EnumUserTypeFieldUpdateOperationsInput>;
  unreadMessage?: InputMaybe<IntFieldUpdateOperationsInput>;
  username?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutFromChatsInput = {
  ChannelInvite?: InputMaybe<ChannelInviteUpdateManyWithoutUserNestedInput>;
  avatar?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  friendsA?: InputMaybe<UserFriendUpdateManyWithoutUserANestedInput>;
  friendsB?: InputMaybe<UserFriendUpdateManyWithoutUserBNestedInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  intro?: InputMaybe<StringFieldUpdateOperationsInput>;
  nickname?: InputMaybe<StringFieldUpdateOperationsInput>;
  password?: InputMaybe<StringFieldUpdateOperationsInput>;
  profileBanner?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  targetChats?: InputMaybe<ChatUpdateManyWithoutTargetUserNestedInput>;
  type?: InputMaybe<EnumUserTypeFieldUpdateOperationsInput>;
  unreadMessage?: InputMaybe<IntFieldUpdateOperationsInput>;
  username?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutTargetChatsInput = {
  ChannelInvite?: InputMaybe<ChannelInviteUpdateManyWithoutUserNestedInput>;
  avatar?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  friendsA?: InputMaybe<UserFriendUpdateManyWithoutUserANestedInput>;
  friendsB?: InputMaybe<UserFriendUpdateManyWithoutUserBNestedInput>;
  fromChats?: InputMaybe<ChatUpdateManyWithoutUserNestedInput>;
  id?: InputMaybe<BigIntFieldUpdateOperationsInput>;
  intro?: InputMaybe<StringFieldUpdateOperationsInput>;
  nickname?: InputMaybe<StringFieldUpdateOperationsInput>;
  password?: InputMaybe<StringFieldUpdateOperationsInput>;
  profileBanner?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumUserTypeFieldUpdateOperationsInput>;
  unreadMessage?: InputMaybe<IntFieldUpdateOperationsInput>;
  username?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type UserUpsertWithoutFriendsAInput = {
  create: UserCreateWithoutFriendsAInput;
  update: UserUpdateWithoutFriendsAInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpsertWithoutFriendsBInput = {
  create: UserCreateWithoutFriendsBInput;
  update: UserUpdateWithoutFriendsBInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpsertWithoutFromChatsInput = {
  create: UserCreateWithoutFromChatsInput;
  update: UserUpdateWithoutFromChatsInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpsertWithoutTargetChatsInput = {
  create: UserCreateWithoutTargetChatsInput;
  update: UserUpdateWithoutTargetChatsInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  ChannelInvite?: InputMaybe<ChannelInviteListRelationFilter>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  avatar?: InputMaybe<StringNullableFilter>;
  friendsA?: InputMaybe<UserFriendListRelationFilter>;
  friendsB?: InputMaybe<UserFriendListRelationFilter>;
  fromChats?: InputMaybe<ChatListRelationFilter>;
  intro?: InputMaybe<StringFilter>;
  nickname?: InputMaybe<StringFilter>;
  nicknameNo?: InputMaybe<IntFilter>;
  profileBanner?: InputMaybe<StringNullableFilter>;
  targetChats?: InputMaybe<ChatListRelationFilter>;
  type?: InputMaybe<EnumUserTypeFilter>;
  unreadMessage?: InputMaybe<IntFilter>;
};

export type UserWhereUniqueInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  ChannelInvite?: InputMaybe<ChannelInviteListRelationFilter>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  avatar?: InputMaybe<StringNullableFilter>;
  friendsA?: InputMaybe<UserFriendListRelationFilter>;
  friendsB?: InputMaybe<UserFriendListRelationFilter>;
  fromChats?: InputMaybe<ChatListRelationFilter>;
  id?: InputMaybe<Scalars['BigInt']['input']>;
  intro?: InputMaybe<StringFilter>;
  nickname?: InputMaybe<StringFilter>;
  nicknameNo?: InputMaybe<IntFilter>;
  password?: InputMaybe<StringFilter>;
  profileBanner?: InputMaybe<StringNullableFilter>;
  targetChats?: InputMaybe<ChatListRelationFilter>;
  type?: InputMaybe<EnumUserTypeFilter>;
  unreadMessage?: InputMaybe<IntFilter>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type FetchChatsQueryVariables = Exact<{
  target: ChatTarget;
  where: ChatWhereInput;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<ChatWhereUniqueInput>;
  order: SortOrder;
}>;


export type FetchChatsQuery = { __typename?: 'Query', chats: Array<{ __typename?: 'Chat', id: any, type: ChatType, message: any, createdTime: any, user?: { __typename?: 'User', id: any, nickname: string, nicknameNo: number, avatar?: string | null } | null, targetUser?: { __typename?: 'User', id: any, nickname: string, nicknameNo: number, avatar?: string | null } | null }> };

export type SendChatMessageMutationVariables = Exact<{
  data: ChatCreateInput;
}>;


export type SendChatMessageMutation = { __typename?: 'Mutation', createChatMessage: { __typename?: 'Chat', id: any } };

export type CreateChannelRoomMutationVariables = Exact<{
  where: ChannelWhereUniqueInput;
  data: ChannelUpdateInput;
}>;


export type CreateChannelRoomMutation = { __typename?: 'Mutation', channelUpdate: { __typename?: 'Channel', id: any } };

export type CreateChannelInviteMutationVariables = Exact<{
  id: Scalars['BigInt']['input'];
}>;


export type CreateChannelInviteMutation = { __typename?: 'Mutation', channelCreateInvite: { __typename?: 'ChannelInvite', id: any, code: string } };

export type CreateChannelMutationVariables = Exact<{
  data: ChannelCreateInput;
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', channelCreate: { __typename?: 'Channel', id: any } };

export type FetchCurrentUserForUpdateQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCurrentUserForUpdateQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: any, type: UserType, nickname: string, nicknameNo: number, avatar?: string | null, sessionState: UserSessionState, intro: string, profileBanner?: string | null } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  data: UserProfileUpdateInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', userProfileUpdate: { __typename?: 'User', id: any } };

export type UpdateUserNicknameMutationVariables = Exact<{
  nickname: Scalars['String']['input'];
}>;


export type UpdateUserNicknameMutation = { __typename?: 'Mutation', userNicknameUpdate: { __typename?: 'User', id: any } };

export type GetUserPopoverInfoQueryVariables = Exact<{
  nickname: Scalars['String']['input'];
  no: Scalars['Int']['input'];
}>;


export type GetUserPopoverInfoQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: any, type: UserType, nickname: string, nicknameNo: number, avatar?: string | null, sessionState: UserSessionState, intro: string, profileBanner?: string | null } | null };

export type ListUserChannelQueryVariables = Exact<{ [key: string]: never; }>;


export type ListUserChannelQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: any, nickname: string, nicknameNo: number, channels?: Array<{ __typename?: 'ChannelToUser', channel: { __typename?: 'Channel', id: any, name: string, code: string, avatar?: string | null, ownerUser: (
          { __typename?: 'User' }
          & { ' $fragmentRefs'?: { 'UserFragFragment': UserFragFragment } }
        ) } }> | null } | null };

export type UserFragFragment = { __typename?: 'User', id: any, nickname: string, nicknameNo: number, sessionState: UserSessionState, avatar?: string | null } & { ' $fragmentName'?: 'UserFragFragment' };

export type GetChannelDetailQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GetChannelDetailQuery = { __typename?: 'Query', channels: Array<{ __typename?: 'Channel', id: any, name: string, code: string, avatar?: string | null, currentUser?: { __typename?: 'ChannelToUser', userId: any, channelRole: { __typename?: 'ChannelRole', id: any, name: string, permissions?: Array<{ __typename?: 'ChannelRolePermission', id: any, code: ChannelRolePermissionCode }> | null } } | null, ownerUser: { __typename?: 'User', id: any, nickname: string, nicknameNo: number, sessionState: UserSessionState, avatar?: string | null }, users?: Array<{ __typename?: 'ChannelToUser', role: { __typename?: 'ChannelRole', name: string, color?: string | null }, user: { __typename?: 'User', id: any, nickname: string, nicknameNo: number, sessionState: UserSessionState, avatar?: string | null } }> | null, categories?: Array<{ __typename?: 'ChannelCategory', id: any, name: string, rooms?: Array<{ __typename?: 'Room', id: any, name: string, maxMember: number, sort: number, channelId: any, users: Array<{ __typename?: 'User', id: any, nickname: string, nicknameNo: number, avatar?: string | null }> }> | null }> | null } | null> };

export type FetchUserFriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchUserFriendsQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: any, nickname: string, nicknameNo: number } | null, userFriends: Array<{ __typename?: 'UserFriend', id: any, userAAccept: boolean, userBAccept: boolean, lastChatTime: any, userA: { __typename?: 'User', id: any, nickname: string, nicknameNo: number, avatar?: string | null, type: UserType }, userB: { __typename?: 'User', id: any, nickname: string, nicknameNo: number, avatar?: string | null, type: UserType } }> };

export type UserCreateMutationVariables = Exact<{
  data: UserCreateInput;
}>;


export type UserCreateMutation = { __typename?: 'Mutation', userCreate: { __typename?: 'UserSession', userId: any, sessionToken: string } };

export type UserLoginMutationVariables = Exact<{
  args: UserSessionCreateInput;
}>;


export type UserLoginMutation = { __typename?: 'Mutation', userSessionCreate: { __typename?: 'UserSession', userId: any, sessionToken: string } };

export type ExitChannelMutationVariables = Exact<{
  id: Scalars['BigInt']['input'];
}>;


export type ExitChannelMutation = { __typename?: 'Mutation', channelExit: boolean };

export type JoinChannelMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type JoinChannelMutation = { __typename?: 'Mutation', channelJoin: { __typename?: 'Channel', id: any, code: string } };

export type DeleteRoomMutationVariables = Exact<{
  id: Scalars['BigInt']['input'];
}>;


export type DeleteRoomMutation = { __typename?: 'Mutation', roomDelete: { __typename?: 'Room', id: any } };

export type UpdateRoomMutationVariables = Exact<{
  id: Scalars['BigInt']['input'];
  data: RoomUpdateInput;
}>;


export type UpdateRoomMutation = { __typename?: 'Mutation', roomUpdate: { __typename?: 'Room', id: any } };

export type FetchCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCurrentUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: any, nickname: string, nicknameNo: number } | null };

export const UserFragFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFrag"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"sessionState"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<UserFragFragment, unknown>;
export const FetchChatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchChats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"target"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatTarget"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatWhereInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatWhereUniqueInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortOrder"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"target"},"value":{"kind":"Variable","name":{"kind":"Name","value":"target"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"targetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"createdTime"}}]}}]}}]} as unknown as DocumentNode<FetchChatsQuery, FetchChatsQueryVariables>;
export const SendChatMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendChatMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChatMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SendChatMessageMutation, SendChatMessageMutationVariables>;
export const CreateChannelRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createChannelRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChannelWhereUniqueInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChannelUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateChannelRoomMutation, CreateChannelRoomMutationVariables>;
export const CreateChannelInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createChannelInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelCreateInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<CreateChannelInviteMutation, CreateChannelInviteMutationVariables>;
export const CreateChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChannelCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateChannelMutation, CreateChannelMutationVariables>;
export const FetchCurrentUserForUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchCurrentUserForUpdate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"nicknameNo"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"equals"},"value":{"kind":"IntValue","value":"-1"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"sessionState"}},{"kind":"Field","name":{"kind":"Name","value":"intro"}},{"kind":"Field","name":{"kind":"Name","value":"profileBanner"}}]}}]}}]} as unknown as DocumentNode<FetchCurrentUserForUpdateQuery, FetchCurrentUserForUpdateQueryVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfileUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfileUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const UpdateUserNicknameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserNickname"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nickname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userNicknameUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"nickname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nickname"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserNicknameMutation, UpdateUserNicknameMutationVariables>;
export const GetUserPopoverInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserPopoverInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nickname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"no"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"nickname"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"equals"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nickname"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"nicknameNo"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"equals"},"value":{"kind":"Variable","name":{"kind":"Name","value":"no"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"sessionState"}},{"kind":"Field","name":{"kind":"Name","value":"intro"}},{"kind":"Field","name":{"kind":"Name","value":"profileBanner"}}]}}]}}]} as unknown as DocumentNode<GetUserPopoverInfoQuery, GetUserPopoverInfoQueryVariables>;
export const ListUserChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listUserChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"nicknameNo"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"equals"},"value":{"kind":"IntValue","value":"-1"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFrag"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFrag"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"sessionState"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<ListUserChannelQuery, ListUserChannelQueryVariables>;
export const GetChannelDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChannelDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"code"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"equals"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"channelRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"sessionState"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"channelRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"sessionState"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxMember"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetChannelDetailQuery, GetChannelDetailQueryVariables>;
export const FetchUserFriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchUserFriends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"currentUser"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"nicknameNo"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"equals"},"value":{"kind":"IntValue","value":"-1"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userFriends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userAAccept"}},{"kind":"Field","name":{"kind":"Name","value":"userBAccept"}},{"kind":"Field","name":{"kind":"Name","value":"lastChatTime"}},{"kind":"Field","name":{"kind":"Name","value":"userA"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userB"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<FetchUserFriendsQuery, FetchUserFriendsQueryVariables>;
export const UserCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionToken"}}]}}]}}]} as unknown as DocumentNode<UserCreateMutation, UserCreateMutationVariables>;
export const UserLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserSessionCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userSessionCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionToken"}}]}}]}}]} as unknown as DocumentNode<UserLoginMutation, UserLoginMutationVariables>;
export const ExitChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"exitChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelExit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<ExitChannelMutation, ExitChannelMutationVariables>;
export const JoinChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"joinChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelJoin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<JoinChannelMutation, JoinChannelMutationVariables>;
export const DeleteRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteRoomMutation, DeleteRoomMutationVariables>;
export const UpdateRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoomUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateRoomMutation, UpdateRoomMutationVariables>;
export const FetchCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"nicknameNo"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"equals"},"value":{"kind":"IntValue","value":"-1"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"nicknameNo"}}]}}]}}]} as unknown as DocumentNode<FetchCurrentUserQuery, FetchCurrentUserQueryVariables>;