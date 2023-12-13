import { ChatTarget } from "@/@generated/graphql";
import { ChatPannel } from "@/components/business";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

export const RoomPage: React.FC = () => {
  const params = useParams<{ roomId: string }>();

  const roomId = useMemo(() => Number(params.roomId), [params.roomId]);
  const pannel = useMemo(() => <ChatPannel type={ChatTarget.Room} roomId={roomId} key={roomId} />, [roomId]);

  return pannel;
};
