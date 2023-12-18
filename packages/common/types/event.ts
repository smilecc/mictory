export type NewChatMessageTarget = "ROOM" | "USER";

export type NewChatMessageEvent =
  | NewChatMessageEventBase<
      "USER",
      {
        toUserId: string | bigint;
      }
    >
  | NewChatMessageEventBase<
      "ROOM",
      {
        toRoomId: string | bigint;
      }
    >;

export type NewChatMessageEventBase<TG extends NewChatMessageTarget, T> = {
  target: TG;
  text: string;
  fromUser: {
    id: string | bigint;
    nickname: string;
    nicknameNo: number;
  };
} & T;
