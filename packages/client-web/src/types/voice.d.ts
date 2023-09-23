export interface IGainSetting {
  microphone: number;
  volume: number;
  historyMicrophone?: number;
  historyVolume?: number;
}

export interface IUserMediaStream {
  mediaStream: MediaStream;
  userId: number;
  closed: boolean;
  isMyself?: boolean;
}
