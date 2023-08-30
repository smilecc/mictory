import type { WebRtcServer, Router, Worker, WebRtcTransport } from 'mediasoup/node/lib/types';

export type RoomId = number | string;
export type WorkerId = number | string;
export type Room = {
  roomId: RoomId;
  workerId: WorkerId;
  sessions: RoomSession[];
};

export type WorkerAppData = {
  id: WorkerId;
  webRtcServer: WebRtcServer;
  router: Router;
};

export type MediasoupWorker = Worker<WorkerAppData>;
export type RoomSession = {
  id: string;
  roomId: RoomId;
  userId: bigint;
  workerId: WorkerId;
  transports: SessionTransport[];
};

export type SessionTransportDirection = 'Producer' | 'Consumer';

export type SessionTransport = {
  transport: WebRtcTransport;
  direction: SessionTransportDirection;
};

export type MessageGetRouterRtpCapabilities = {
  roomId: RoomId;
};

export type MessageJoinRoom = {
  roomId: RoomId;
};
