import { makeAutoObservable, runInAction } from "mobx";
import { ListUserChannelQuery } from "@/@generated/graphql";
import { getSocketClient } from "@/contexts";
import * as mediasoupClient from "mediasoup-client";
import type { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Producer, Transport } from "mediasoup-client/lib/types";
import { debounce, throttle } from "lodash-es";
import { IGainSetting, IMediaDeviceSetting, IUserMediaStream } from "@/types";
import { StoreStorage } from "@/lib/store-storage";
import { NoiseSuppressionProcessor } from "@shiguredo/noise-suppression";
import _ from "lodash-es";

export class ChannelStore {
  constructor() {
    makeAutoObservable(this);

    this.mediasoupDevice = new mediasoupClient.Device();
    getSocketClient().on("connect", () => this.handleSocketConnect());
    getSocketClient().on("disconnect", () => this.handleSocketDisconnect());
  }

  firstLoading: boolean = true;
  userWithChannels: ListUserChannelQuery["user"] = undefined;

  activeChannelId?: number = undefined;
  joinedChannelId?: number = undefined;

  joinedRoomId?: number = undefined;
  chatRoomId?: number = undefined;

  // 当前语音连接状态
  connectionState: mediasoupClient.types.ConnectionState = "new";

  // 声音增益
  audioGain: IGainSetting = StoreStorage.load(ChannelStore, "audioGain", {
    microphone: 100,
    volume: 100,
  });

  // 声音降噪
  private _audioNoiseSuppression: boolean = StoreStorage.load(ChannelStore, "audioNoiseSuppression", true);

  get audioNoiseSuppression() {
    return this._audioNoiseSuppression;
  }

  set audioNoiseSuppression(v: boolean) {
    this._audioNoiseSuppression = StoreStorage.save(ChannelStore, "audioNoiseSuppression", v);
  }

  // mediasoup设备
  mediasoupDevice: mediasoupClient.Device;

  // 消费者连接
  recvTransport?: Transport;

  // 生产者连接
  sendTransport?: Transport;

  // 当前生产者
  producer?: Producer;

  // 媒体流
  mediaStreams: IUserMediaStream[] = [];

  watchVolumeUsers: Set<number> = new Set();

  // 降噪处理器
  noiseProcessor = new NoiseSuppressionProcessor("/noise-suppression/");
  noiseProcessor2 = new NoiseSuppressionProcessor("/noise-suppression/");

  // 当前用户的音频流
  myAudioMediaStream?: IUserMediaStream;

  // 用户设备列表
  mediaDeviceInfos: MediaDeviceInfo[] = [];

  // 用户音频设备
  audioDevice: IMediaDeviceSetting = StoreStorage.load(ChannelStore, "audioDevice", {
    inputDeviceId: "",
    outputDeviceId: "",
    autoGainControl: true,
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 48000,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setAudioDevice(k: keyof IMediaDeviceSetting, v: any, reloadAudioMediaDevice = true) {
    console.log("修改声音设备设置", k, v);
    if (!v && (k === "inputDeviceId" || k === "outputDeviceId")) {
      console.warn("设备ID为空，跳过设置", k, v);
      return;
    }

    this.audioDevice = StoreStorage.save(ChannelStore, "audioDevice", {
      ...this.audioDevice,
      [k]: v,
    });

    // 若修改的不是输出设备，则重新加载媒体设备
    if (k !== "outputDeviceId" && reloadAudioMediaDevice) {
      await this.reloadAudioMediaDevice();
    }
  }

  async loadMediaDevices() {
    // 先请求一次媒体设备权限
    await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .catch((e) => {
        this.mediaDeviceInfos = [
          {
            deviceId: "",
            groupId: "",
            kind: "audioinput",
            label: "",
          },
          {
            deviceId: "",
            groupId: "",
            kind: "audiooutput",
            label: "",
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any;
        throw e;
      });

    if (!navigator.mediaDevices.ondevicechange) {
      navigator.mediaDevices.ondevicechange = () => {
        console.log("用户设备发生变化");
        this.loadMediaDevices();
      };
    }

    const mediaDeviceInfos = await navigator.mediaDevices.enumerateDevices();
    runInAction(() => {
      this.mediaDeviceInfos = mediaDeviceInfos;
      const defaultIds = ["default", "communications"];
      console.log("媒体设备列表", this.mediaDeviceInfos);

      const audioInputDevices = mediaDeviceInfos.filter((it) => it.kind === "audioinput");
      const audioOutputDevices = mediaDeviceInfos.filter((it) => it.kind === "audiooutput");

      // 旧设备不存在，读取默认值
      if (
        audioInputDevices.length > 0 &&
        !audioInputDevices.find((it) => it.deviceId === this.audioDevice.inputDeviceId)
      ) {
        const defaultDeviceId = audioInputDevices.find((it) => defaultIds.includes(it.deviceId))?.deviceId;
        const firstDevice = _.first(audioInputDevices);

        this.setAudioDevice("inputDeviceId", defaultDeviceId || firstDevice!.deviceId);
      }

      if (
        audioOutputDevices.length > 0 &&
        !audioOutputDevices.find((it) => it.deviceId === this.audioDevice.outputDeviceId)
      ) {
        const defaultDeviceId = audioOutputDevices.find((it) => defaultIds.includes(it.deviceId))?.deviceId;
        const firstDevice = _.first(audioOutputDevices);

        this.setAudioDevice("outputDeviceId", defaultDeviceId || firstDevice!.deviceId);
      }
    });
  }

  // 设置输入媒体设备
  async setInputMediaDevice(deviceId: string) {
    this.setAudioDevice("inputDeviceId", deviceId);
    await this.reloadAudioMediaDevice();
  }

  async handleSocketConnect() {
    console.log("getSocketClient() connected", this.activeChannelId);

    if (this.activeChannelId) {
      getSocketClient().emit("activeChannel", { channelId: this.activeChannelId });
    }

    getSocketClient().on("newProducer", (producer) => {
      console.log("ChannelStore:newProducer", producer);
      this.createConsumer(producer.producerId);
    });

    getSocketClient().on("roomMemberLeave", (data) => {
      const userId: number = data.userId;
      console.log("roomMemberLeave", data);

      // 清除音量监听
      this.watchVolumeUsers.delete(userId);

      // 设置用户媒体流关闭
      const userMediaStream = this.mediaStreams.find((it) => it.userId === userId);
      if (userMediaStream) {
        userMediaStream.closed = true;
        console.log("设置userMediaStream.closed", userMediaStream);
      }
    });

    getSocketClient().on("speak", (speaker) => {
      console.log("ChannelStore:speak", speaker);
    });
  }

  async handleSocketDisconnect() {
    console.log("getSocketClient() disconnected");

    getSocketClient().off("newProducer");
    getSocketClient().off("roomMemberLeave");
    getSocketClient().off("speak");
  }

  async cleanUserState() {
    this.firstLoading = true;
    this.userWithChannels = undefined;

    this.clearRoomState();
  }

  clearRoomState() {
    this.watchVolumeUsers.clear();
    this.mediaStreams.forEach((it) => {
      it.closed = true;
    });

    this.connectionState = "new";
    this.joinedRoomId = undefined;
    this.joinedChannelId = undefined;
    this.mediaStreams = [];
  }

  async getUserAudioMedia() {
    try {
      const { autoGainControl, echoCancellation, noiseSuppression, sampleRate, sampleSize } = this.audioDevice;
      const constraints: MediaTrackConstraints = {
        deviceId: this.audioDevice.inputDeviceId,
        autoGainControl,
        echoCancellation,
        noiseSuppression,
        sampleRate,
        sampleSize,
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { ...constraints },
        video: false,
      });

      await stream.getAudioTracks()?.[0]?.applyConstraints({ ...constraints });

      return stream;
    } catch {
      console.error("获取媒体设备失败");
      // 创建一个空白媒体流
      return new AudioContext().createMediaStreamDestination().stream;
    }
  }

  /**
   * 加入房间
   * @param roomId 房间ID
   */
  async joinRoom(roomId: number, channelId: number) {
    if (this.joinedRoomId) {
      await this.exitRoom();
    }

    this.clearRoomState();
    this.joinedRoomId = roomId;
    this.joinedChannelId = channelId;
    this.mediasoupDevice = new mediasoupClient.Device();

    const rtpCapabilities = (await getSocketClient().emitWithAck("getRouterRtpCapabilities", {
      roomId,
    })) as RtpCapabilities;
    console.log("JoinRoom:rtpCapabilities", roomId, rtpCapabilities);

    const roomSession = await getSocketClient().emitWithAck("joinRoom", { roomId });
    console.log("JoinRoom:roomSession", roomId, roomSession);

    await this.mediasoupDevice.load({ routerRtpCapabilities: rtpCapabilities });

    // 创建消费者
    const remoteRecvTransport = await getSocketClient().emitWithAck("createTransport", {
      direction: "Consumer",
    });

    const recvTransport = this.mediasoupDevice.createRecvTransport(remoteRecvTransport);
    this.recvTransport = recvTransport;

    recvTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      console.log("JoinRoom:recvTransport:connect", roomId);
      getSocketClient()
        .emitWithAck("connectTransport", {
          transportId: recvTransport.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback);
    });

    recvTransport.on("connectionstatechange", (state) => console.log("recv:connectionstatechange", state, roomId));

    // 获取当前房间已存在的生产者
    const producers = (await getSocketClient().emitWithAck("getRoomProducers")) as string[];
    console.log("JoinRoom:producers", roomId, producers);

    // 对已经存在的生产者进行消费
    producers.forEach((it) => this.createConsumer(it));

    // 创建生产者
    const remoteSendTransport = await getSocketClient().emitWithAck("createTransport", {
      direction: "Producer",
    });

    const sendTransport = this.mediasoupDevice.createSendTransport(remoteSendTransport);
    this.sendTransport = sendTransport;

    // 连接生产
    sendTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      getSocketClient()
        .emitWithAck("connectTransport", {
          transportId: sendTransport.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback);
    });

    sendTransport.on("produce", async ({ kind, rtpParameters }, callback) => {
      const produceResp = await getSocketClient().emitWithAck("produceTransport", {
        transportId: sendTransport.id,
        kind,
        rtpParameters,
      });

      callback({ id: produceResp.id });
    });

    sendTransport.on("connectionstatechange", (state) => {
      if (channelId === this.joinedChannelId) {
        runInAction(() => {
          this.connectionState = state;
        });
      }

      console.log("send:connectionstatechange", state, roomId);
    });
  }

  /**
   * 退出房间
   */
  async exitRoom() {
    if (await getSocketClient().emitWithAck("exitRoom")) {
      this.recvTransport?.close();
      this.sendTransport?.close();

      runInAction(() => {
        this.clearRoomState();
      });
    }
  }

  async toggleNoiseSuppression() {
    this.audioNoiseSuppression = !this.audioNoiseSuppression;
    await this.setAudioDevice("noiseSuppression", this.audioNoiseSuppression);
    console.log("切换麦克风降噪", this.audioNoiseSuppression);
  }

  async reloadAudioMediaDevice() {
    const stream = await this.getUserAudioMedia();

    console.log("this.myAudioMediaStream", this.myAudioMediaStream);
    if (this.myAudioMediaStream) {
      // 将之前的媒体流设置为已关闭
      const userId = this.myAudioMediaStream.userId;
      this.myAudioMediaStream.closed = true;

      // 创建新的流对象
      this.myAudioMediaStream = {
        mediaStream: stream,
        userId,
        closed: false,
        ready: false,
      };

      await this.modifyAudioGain(this.myAudioMediaStream, "microphone");
      this.watchMediaStreamVolume(this.myAudioMediaStream);

      this.myAudioMediaStream!.ready = true;
    }

    if (!this.producer?.closed) {
      console.log("replaceTrack");
      this.producer?.replaceTrack({
        track: stream.getAudioTracks()[0],
      });
    }

    return this.myAudioMediaStream?.mediaStream || stream;
  }

  /**
   * 创建消费者
   * @param producerId 生产者ID
   * @returns
   */
  async createConsumer(producerId: string) {
    if (!this.recvTransport) {
      console.log("消费生产者失败，recvTransport为空", producerId);
      return;
    }

    const consumerData = await getSocketClient().emitWithAck("consumeTransport", {
      producerId: producerId,
      transportId: this.recvTransport.id,
      rtpCapabilities: this.mediasoupDevice.rtpCapabilities,
    });

    const consumer = await this.recvTransport.consume({
      ...consumerData,
    });

    const userId: number = consumerData.producerUserId;
    const ms = new MediaStream();
    ms.addTrack(consumer.track);

    const userMediaStream: IUserMediaStream = {
      mediaStream: ms,
      userId: userId,
      closed: false,
      isMyself: true,
      ready: false,
    };

    runInAction(async () => {
      this.mediaStreams.push(userMediaStream);
      const item = this.mediaStreams.find((it) => it.mediaStream.id === userMediaStream.mediaStream.id)!;

      await this.modifyAudioGain(item, "volume");
      this.watchMediaStreamVolume(item);

      item.ready = true;
    });

    console.log("consumeProducer:consumer", consumer.id, "producerId", producerId);
  }

  /**
   * 创建消费者
   * @param stream 媒体流
   * @returns
   */
  async createProducer(stream: MediaStream) {
    if (!this.sendTransport) {
      console.log("创建生产者失败，sendTransport为空", stream.id, stream);
      return;
    }

    this.myAudioMediaStream = {
      mediaStream: stream,
      userId: this.userWithChannels?.id,
      closed: false,
      isMyself: true,
      ready: false,
    };

    await this.modifyAudioGain(this.myAudioMediaStream, "microphone");
    this.watchMediaStreamVolume(this.myAudioMediaStream);

    this.producer = await this.sendTransport.produce({
      track: this.myAudioMediaStream.mediaStream.getTracks()[0],
    });

    this.myAudioMediaStream!.ready = true;
    console.log("createProducer:producer", this.producer.id);
  }

  /**
   * 监听麦克风音量变化
   * @param stream 媒体流
   * @param userId 用户ID
   */
  watchMediaStreamVolume(userStream: IUserMediaStream) {
    const stream = userStream.mediaStream;
    const userId = userStream.userId;
    console.log("watchMediaStreamVolume", userId);

    this.watchVolumeUsers.add(userId);
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);
    // 如果是自己说话则使用当前用户会话ID
    const onStopSpeak = debounce(() => {
      window.dispatchEvent(new CustomEvent("user:stop_speak", { detail: { userId } }));
    }, 200);

    const onSpeak = throttle(
      () => {
        window.dispatchEvent(new CustomEvent("user:speak", { detail: { userId } }));
        onStopSpeak();
      },
      100,
      {
        leading: true,
      },
    );

    const pcmData = new Float32Array(analyserNode.fftSize);
    const onFrame = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) {
        sumSquares += amplitude * amplitude;
      }
      const volume = Math.sqrt(sumSquares / pcmData.length);
      if (volume > 0.05) {
        onSpeak();
      }

      if (this.watchVolumeUsers.has(userId) && !userStream.closed) {
        window.requestAnimationFrame(onFrame);
      }
    };
    window.requestAnimationFrame(onFrame);
  }

  async modifyAudioGain(userStream: IUserMediaStream, gainKey: keyof IGainSetting) {
    const stream = userStream.mediaStream;
    const getValue = () => {
      const globalGainValue = this.audioGain?.[gainKey];
      return typeof globalGainValue === "number" ? globalGainValue / 100 : 1;
    };

    const ctx = new AudioContext();
    const gainNode = ctx.createGain();
    const source = ctx.createMediaStreamSource(stream);
    if (gainKey === "microphone") {
      const splitter = ctx.createChannelSplitter(source.channelCount);
      const merger = ctx.createChannelMerger(source.channelCount);

      const destination = ctx.createMediaStreamDestination();
      console.log("source.channelCount", source.channelCount);

      source.connect(splitter);

      const streamDestL = ctx.createMediaStreamDestination();
      streamDestL.channelCount = 1;
      splitter.connect(gainNode, 0).connect(streamDestL);

      // 终止上次的降噪
      if (this.noiseProcessor.isProcessing()) {
        this.noiseProcessor.stopProcessing();
      }

      if (this.noiseProcessor2.isProcessing()) {
        this.noiseProcessor2.stopProcessing();
      }

      if (this.audioNoiseSuppression) {
        const track = streamDestL.stream.getAudioTracks()[0];
        streamDestL.stream.removeTrack(track);
        streamDestL.stream.addTrack(await this.noiseProcessor.startProcessing(track));
      }

      const source1 = ctx.createMediaStreamSource(streamDestL.stream);
      source1.connect(merger, 0, 0);

      // 如果是立体声，则处理第二声道
      if (source.channelCount > 1) {
        console.log("立体声声道，处理第二声道");

        const streamDestR = ctx.createMediaStreamDestination();
        streamDestR.channelCount = 1;
        splitter.connect(gainNode, 1).connect(streamDestR);

        // 根据情况开启降噪
        if (this.audioNoiseSuppression) {
          const track2 = streamDestR.stream.getAudioTracks()[0];
          streamDestR.stream.removeTrack(track2);
          streamDestR.stream.addTrack(await this.noiseProcessor2.startProcessing(track2));
        }

        const source2 = ctx.createMediaStreamSource(streamDestR.stream);
        source2.connect(merger, 0, 1);
      }

      merger.connect(destination);
      stream.removeTrack(stream.getAudioTracks()[0]);
      stream.addTrack(destination.stream.getAudioTracks()[0]);
    } else {
      const destination = ctx.createMediaStreamDestination();
      source.connect(gainNode).connect(destination);
      userStream.actualStream = destination.stream;
    }
    gainNode.gain.value = getValue();

    const onFrame = () => {
      gainNode.gain.linearRampToValueAtTime(getValue(), ctx.currentTime);

      if (gainKey === "microphone" && this.joinedChannelId && !userStream.closed) {
        window.requestAnimationFrame(onFrame);
      }

      if (gainKey === "volume" && !userStream.closed) {
        window.requestAnimationFrame(onFrame);
      }
    };
    window.requestAnimationFrame(onFrame);
  }

  setAudioGainItem(k: keyof IGainSetting, v: number) {
    this.audioGain = StoreStorage.save(ChannelStore, "audioGain", {
      ...this.audioGain,
      [k]: v,
    });
  }

  get joinedChannel() {
    console.log("this.joinedChannelId", this.joinedChannelId);
    if (!this.joinedChannelId) {
      return undefined;
    }

    return this.userWithChannels?.channels?.find((it) => it.channel.id === this.joinedChannelId)?.channel;
  }
}
