import type {
  WebRtcServer,
  Router,
  Worker,
  WebRtcTransport,
  DtlsParameters,
  RtpParameters,
  MediaKind,
  RtpCapabilities,
  Producer,
  ActiveSpeakerObserver,
  AudioLevelObserver,
} from 'mediasoup/node/lib/types';

export type TableId = bigint | number | string;
export type WorkerId = number | string;
export type Room = {
  roomId: TableId;
  channelId: bigint;
  workerId: WorkerId;
  sessions: RoomSession[];
  activeSpeakerObserver?: ActiveSpeakerObserver;
  audioLevelObserver?: AudioLevelObserver;
};

export type WorkerAppData = {
  id: WorkerId;
  webRtcServer: WebRtcServer;
  router: Router;
};

export type MediasoupWorker = Worker<WorkerAppData>;
export type RoomSession = {
  id: string;
  roomId: TableId;
  userId: bigint;
  workerId: WorkerId;
  transports: SessionTransport[];
};

export type SessionTransportDirection = 'Producer' | 'Consumer';

export type SessionTransport = {
  userId: bigint;
  sessionId: string;
  transport: WebRtcTransport;
  direction: SessionTransportDirection;
  producer?: Producer;
};

export type MessageGetRouterRtpCapabilities = {
  roomId: TableId;
};

export type MessageActiveChannel = {
  channelId: TableId;
};

export type MessageJoinRoom = {
  roomId: TableId;
};

export type MessageCreateTransport = {
  direction: SessionTransportDirection;
};

export type MessageConnectTransport = {
  transportId: string;
  dtlsParameters: DtlsParameters;
};

export type MessageProduceTransport = {
  transportId: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
};

export type MessageConsumeTransport = {
  transportId: string;
  producerId: string;
  rtpCapabilities: RtpCapabilities;
};
