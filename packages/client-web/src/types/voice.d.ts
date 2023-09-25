export interface IGainSetting {
  microphone: number;
  volume: number;
  historyMicrophone?: number;
  historyVolume?: number;
}

export interface IMediaDeviceSetting {
  inputDeviceId: string;
  outputDeviceId: string;
  autoGainControl: boolean;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  sampleRate?: number;
  sampleSize?: number;
}

export interface IUserMediaStream {
  mediaStream: MediaStream;
  actualStream?: MediaStream;
  userId: number;
  closed: boolean;
  ready: boolean;
  isMyself?: boolean;
}
