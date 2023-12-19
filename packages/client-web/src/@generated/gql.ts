/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query fetchChats($target: ChatTarget!, $where: ChatWhereInput!, $take: Int, $skip: Int, $cursor: ChatWhereUniqueInput, $order: SortOrder!) {\n  chats(target: $target, where: $where, skip: $skip, take: $take, cursor: $cursor, orderBy: { id: $order }) {\n    id\n    type\n    user {\n      id\n      nickname\n      nicknameNo\n      avatar\n    }\n    targetUser {\n      id\n      nickname\n      nicknameNo\n      avatar\n    }\n    message\n    createdTime\n  }\n}": types.FetchChatsDocument,
    "mutation sendChatMessage($data: ChatCreateInput!) {\n  createChatMessage(data: $data) {\n    id\n  }\n}": types.SendChatMessageDocument,
    "mutation createChannelRoom($where: ChannelWhereUniqueInput!, $data: ChannelUpdateInput!) {\n  channelUpdate (where: $where, data: $data) {\n    id\n  }\n}": types.CreateChannelRoomDocument,
    "mutation joinChannel ($code: String!) {\n  channelJoin(data: { code: $code }) {\n    id\n  }\n}": types.JoinChannelDocument,
    "mutation createChannel($data: ChannelCreateInput!) {\n  channelCreate(data: $data) {\n    id\n  }\n}": types.CreateChannelDocument,
    "query getUserPopoverInfo($nickname: String!, $no: Int!) {\n  user(where: { nickname: { equals: $nickname }, nicknameNo: { equals: $no } }) {\n    id\n    type\n    nickname\n    nicknameNo\n    avatar\n    sessionState\n  }\n}": types.GetUserPopoverInfoDocument,
    "\nquery listUserChannel {\n  user(where: { nicknameNo: { equals: -1 } }) {\n    id\n    nickname\n    nicknameNo\n    channels {\n      channel {\n        id\n        name\n        code\n        avatar\n        ownerUser {\n          ...UserFrag\n        }\n      }\n    }\n  }\n}\n\nfragment UserFrag on User {\n  id\n  nickname\n  nicknameNo\n  sessionState\n  avatar\n}\n": types.ListUserChannelDocument,
    "\nquery getChannelDetail($code: String!) {\n  channels (where: { code: { equals: $code } } ) {\n    id\n    name\n    code\n    avatar\n    ownerUser {\n      id\n      nickname\n      nicknameNo\n      sessionState\n      avatar\n    }\n    users {\n      role: channelRole {\n        name\n        color\n      }\n      user {\n        id\n        nickname\n        nicknameNo\n        sessionState\n        avatar\n      }\n    }\n    categories {\n      id\n      name\n      rooms {\n        id\n        name\n        maxMember\n        sort\n        channelId\n        users {\n          id\n          nickname\n          nicknameNo\n          avatar\n        }\n      }\n    }\n  }\n}\n": types.GetChannelDetailDocument,
    "query fetchUserFriends {\n  currentUser: user(where: { nicknameNo: { equals: -1 } }) {\n    id\n    nickname\n    nicknameNo\n  }\n\n  userFriends {\n    id\n    userAAccept\n    userBAccept\n    lastChatTime\n    userA {\n      id\n      nickname\n      nicknameNo\n      avatar\n      type\n    }\n    userB {\n      id\n      nickname\n      nicknameNo\n      avatar\n      type\n    }\n  }\n}": types.FetchUserFriendsDocument,
    "mutation userCreate($data: UserCreateInput!) {\n  userCreate(data: $data) {\n    userId\n    sessionToken\n  }\n}": types.UserCreateDocument,
    "mutation userLogin($args: UserSessionCreateInput!) {\n  userSessionCreate(args: $args) {\n    userId\n    sessionToken\n  }\n}": types.UserLoginDocument,
    "query fetchCurrentUser {\n  user (where: { nicknameNo: { equals: -1 } }) {\n    id\n    nickname\n    nicknameNo\n  }\n}": types.FetchCurrentUserDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fetchChats($target: ChatTarget!, $where: ChatWhereInput!, $take: Int, $skip: Int, $cursor: ChatWhereUniqueInput, $order: SortOrder!) {\n  chats(target: $target, where: $where, skip: $skip, take: $take, cursor: $cursor, orderBy: { id: $order }) {\n    id\n    type\n    user {\n      id\n      nickname\n      nicknameNo\n      avatar\n    }\n    targetUser {\n      id\n      nickname\n      nicknameNo\n      avatar\n    }\n    message\n    createdTime\n  }\n}"): (typeof documents)["query fetchChats($target: ChatTarget!, $where: ChatWhereInput!, $take: Int, $skip: Int, $cursor: ChatWhereUniqueInput, $order: SortOrder!) {\n  chats(target: $target, where: $where, skip: $skip, take: $take, cursor: $cursor, orderBy: { id: $order }) {\n    id\n    type\n    user {\n      id\n      nickname\n      nicknameNo\n      avatar\n    }\n    targetUser {\n      id\n      nickname\n      nicknameNo\n      avatar\n    }\n    message\n    createdTime\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation sendChatMessage($data: ChatCreateInput!) {\n  createChatMessage(data: $data) {\n    id\n  }\n}"): (typeof documents)["mutation sendChatMessage($data: ChatCreateInput!) {\n  createChatMessage(data: $data) {\n    id\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createChannelRoom($where: ChannelWhereUniqueInput!, $data: ChannelUpdateInput!) {\n  channelUpdate (where: $where, data: $data) {\n    id\n  }\n}"): (typeof documents)["mutation createChannelRoom($where: ChannelWhereUniqueInput!, $data: ChannelUpdateInput!) {\n  channelUpdate (where: $where, data: $data) {\n    id\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation joinChannel ($code: String!) {\n  channelJoin(data: { code: $code }) {\n    id\n  }\n}"): (typeof documents)["mutation joinChannel ($code: String!) {\n  channelJoin(data: { code: $code }) {\n    id\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createChannel($data: ChannelCreateInput!) {\n  channelCreate(data: $data) {\n    id\n  }\n}"): (typeof documents)["mutation createChannel($data: ChannelCreateInput!) {\n  channelCreate(data: $data) {\n    id\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query getUserPopoverInfo($nickname: String!, $no: Int!) {\n  user(where: { nickname: { equals: $nickname }, nicknameNo: { equals: $no } }) {\n    id\n    type\n    nickname\n    nicknameNo\n    avatar\n    sessionState\n  }\n}"): (typeof documents)["query getUserPopoverInfo($nickname: String!, $no: Int!) {\n  user(where: { nickname: { equals: $nickname }, nicknameNo: { equals: $no } }) {\n    id\n    type\n    nickname\n    nicknameNo\n    avatar\n    sessionState\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery listUserChannel {\n  user(where: { nicknameNo: { equals: -1 } }) {\n    id\n    nickname\n    nicknameNo\n    channels {\n      channel {\n        id\n        name\n        code\n        avatar\n        ownerUser {\n          ...UserFrag\n        }\n      }\n    }\n  }\n}\n\nfragment UserFrag on User {\n  id\n  nickname\n  nicknameNo\n  sessionState\n  avatar\n}\n"): (typeof documents)["\nquery listUserChannel {\n  user(where: { nicknameNo: { equals: -1 } }) {\n    id\n    nickname\n    nicknameNo\n    channels {\n      channel {\n        id\n        name\n        code\n        avatar\n        ownerUser {\n          ...UserFrag\n        }\n      }\n    }\n  }\n}\n\nfragment UserFrag on User {\n  id\n  nickname\n  nicknameNo\n  sessionState\n  avatar\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery getChannelDetail($code: String!) {\n  channels (where: { code: { equals: $code } } ) {\n    id\n    name\n    code\n    avatar\n    ownerUser {\n      id\n      nickname\n      nicknameNo\n      sessionState\n      avatar\n    }\n    users {\n      role: channelRole {\n        name\n        color\n      }\n      user {\n        id\n        nickname\n        nicknameNo\n        sessionState\n        avatar\n      }\n    }\n    categories {\n      id\n      name\n      rooms {\n        id\n        name\n        maxMember\n        sort\n        channelId\n        users {\n          id\n          nickname\n          nicknameNo\n          avatar\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery getChannelDetail($code: String!) {\n  channels (where: { code: { equals: $code } } ) {\n    id\n    name\n    code\n    avatar\n    ownerUser {\n      id\n      nickname\n      nicknameNo\n      sessionState\n      avatar\n    }\n    users {\n      role: channelRole {\n        name\n        color\n      }\n      user {\n        id\n        nickname\n        nicknameNo\n        sessionState\n        avatar\n      }\n    }\n    categories {\n      id\n      name\n      rooms {\n        id\n        name\n        maxMember\n        sort\n        channelId\n        users {\n          id\n          nickname\n          nicknameNo\n          avatar\n        }\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fetchUserFriends {\n  currentUser: user(where: { nicknameNo: { equals: -1 } }) {\n    id\n    nickname\n    nicknameNo\n  }\n\n  userFriends {\n    id\n    userAAccept\n    userBAccept\n    lastChatTime\n    userA {\n      id\n      nickname\n      nicknameNo\n      avatar\n      type\n    }\n    userB {\n      id\n      nickname\n      nicknameNo\n      avatar\n      type\n    }\n  }\n}"): (typeof documents)["query fetchUserFriends {\n  currentUser: user(where: { nicknameNo: { equals: -1 } }) {\n    id\n    nickname\n    nicknameNo\n  }\n\n  userFriends {\n    id\n    userAAccept\n    userBAccept\n    lastChatTime\n    userA {\n      id\n      nickname\n      nicknameNo\n      avatar\n      type\n    }\n    userB {\n      id\n      nickname\n      nicknameNo\n      avatar\n      type\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation userCreate($data: UserCreateInput!) {\n  userCreate(data: $data) {\n    userId\n    sessionToken\n  }\n}"): (typeof documents)["mutation userCreate($data: UserCreateInput!) {\n  userCreate(data: $data) {\n    userId\n    sessionToken\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation userLogin($args: UserSessionCreateInput!) {\n  userSessionCreate(args: $args) {\n    userId\n    sessionToken\n  }\n}"): (typeof documents)["mutation userLogin($args: UserSessionCreateInput!) {\n  userSessionCreate(args: $args) {\n    userId\n    sessionToken\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fetchCurrentUser {\n  user (where: { nicknameNo: { equals: -1 } }) {\n    id\n    nickname\n    nicknameNo\n  }\n}"): (typeof documents)["query fetchCurrentUser {\n  user (where: { nicknameNo: { equals: -1 } }) {\n    id\n    nickname\n    nicknameNo\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;