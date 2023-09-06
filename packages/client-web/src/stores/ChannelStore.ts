import { makeAutoObservable, runInAction } from "mobx";
import { ListUserChannelQuery } from "@/@generated/graphql";
import { socketClient } from "@/contexts";
import * as mediasoupClient from "mediasoup-client";
import type { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/types";
import { debounce, throttle } from "lodash-es";
import { IGainSetting } from "@/types";
import { StoreStorage } from "@/lib/store-storage";

export class ChannelStore {
  constructor() {
    makeAutoObservable(this);

    this.mediasoupDevice = new mediasoupClient.Device();
    socketClient.on("connect", this.handleSocketConnect);
    socketClient.on("disconnect", this.handleSocketDisconnect);
  }

  firstLoading: boolean = true;
  userWithChannels: ListUserChannelQuery["user"] = undefined;

  joinedChannelId?: number = undefined;

  // 当前语音连接状态
  connectionState: mediasoupClient.types.ConnectionState = "new";

  // 声音增益
  audioGain: IGainSetting = StoreStorage.load(ChannelStore, "audioGain", {
    microphone: 100,
    volume: 100,
  });

  // mediasoup设备
  mediasoupDevice: mediasoupClient.Device;

  // 消费者连接
  recvTransport?: Transport;

  // 生产者连接
  sendTransport?: Transport;

  mediaStreams: MediaStream[] = [];

  watchVolumeUsers: Set<number> = new Set();

  async handleSocketConnect() {
    console.log("SocketClient connected");

    socketClient.on("newProducer", (producer) => {
      console.log("ChannelStore:newProducer", producer);
    });

    socketClient.on("speak", (speaker) => {
      console.log("ChannelStore:speak", speaker);
    });
  }

  async handleSocketDisconnect() {
    console.log("SocketClient disconnected");

    socketClient.off("newProducer");
    socketClient.off("speak");
  }

  async cleanUserState() {
    this.firstLoading = true;
    this.userWithChannels = undefined;
    this.mediaStreams = [];
  }

  /**
   * 加入房间
   * @param roomId 房间ID
   */
  async joinRoom(roomId: number, channelId: number) {
    this.connectionState = "new";
    this.joinedChannelId = channelId;
    this.mediaStreams = [];
    this.mediasoupDevice = new mediasoupClient.Device();

    const rtpCapabilities = (await socketClient.emitWithAck("getRouterRtpCapabilities", { roomId })) as RtpCapabilities;
    console.log("JoinRoom:rtpCapabilities", roomId, rtpCapabilities);

    const roomSession = await socketClient.emitWithAck("joinRoom", { roomId });
    console.log("JoinRoom:roomSession", roomId, roomSession);

    await this.mediasoupDevice.load({ routerRtpCapabilities: rtpCapabilities });

    // 创建消费者
    const remoteRecvTransport = await socketClient.emitWithAck("createTransport", {
      direction: "Consumer",
    });

    const recvTransport = this.mediasoupDevice.createRecvTransport(remoteRecvTransport);
    this.recvTransport = recvTransport;

    recvTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      console.log("JoinRoom:recvTransport:connect", roomId);
      socketClient
        .emitWithAck("connectTransport", {
          transportId: recvTransport.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback);
    });

    recvTransport.on("connectionstatechange", (state) => console.log("recv:connectionstatechange", state, roomId));

    // 获取当前房间已存在的生产者
    const producers = (await socketClient.emitWithAck("getRoomProducers")) as string[];
    console.log("JoinRoom:producers", roomId, producers);

    // 对已经存在的生产者进行消费
    producers.forEach((it) => this.createConsumer(it));

    // 创建生产者
    const remoteSendTransport = await socketClient.emitWithAck("createTransport", {
      direction: "Producer",
    });

    const sendTransport = this.mediasoupDevice.createSendTransport(remoteSendTransport);
    this.sendTransport = sendTransport;

    // 连接生产
    sendTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      socketClient
        .emitWithAck("connectTransport", {
          transportId: sendTransport.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback);
    });

    sendTransport.on("produce", async ({ kind, rtpParameters }, callback) => {
      const produceResp = await socketClient.emitWithAck("produceTransport", {
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
   * 创建消费者
   * @param producerId 生产者ID
   * @returns
   */
  async createConsumer(producerId: string) {
    if (!this.recvTransport) {
      console.log("消费生产者失败，recvTransport为空", producerId);
      return;
    }

    const consumerData = await socketClient.emitWithAck("consumeTransport", {
      producerId: producerId,
      transportId: this.recvTransport.id,
      rtpCapabilities: this.mediasoupDevice.rtpCapabilities,
    });

    const consumer = await this.recvTransport.consume({
      ...consumerData,
    });

    const userId: number = consumerData.producerUserId;
    const ms = new MediaStream();

    this.modifyAudioGain(ms, "volume");
    this.watchMediaStreamVolume(ms, userId);

    ms.addTrack(consumer.track);
    this.mediaStreams.push(ms);

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

    this.modifyAudioGain(stream, "microphone");
    this.watchMediaStreamVolume(stream, this.userWithChannels?.id);
    const producer = await this.sendTransport.produce({
      track: stream.getTracks()[0],
    });

    console.log("createProducer:producer", producer.id);
  }

  /**
   * 监听麦克风音量变化
   * @param stream 媒体流
   * @param userId 用户ID
   */
  watchMediaStreamVolume(stream: MediaStream, userId: number) {
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

      if (this.watchVolumeUsers.has(userId)) {
        window.requestAnimationFrame(onFrame);
      }
    };
    window.requestAnimationFrame(onFrame);
  }

  modifyAudioGain(stream: MediaStream, gainKey: keyof IGainSetting) {
    const getValue = () => {
      const globalGainValue = this.audioGain?.[gainKey];
      return typeof globalGainValue === "number" ? globalGainValue / 100 : 1;
    };

    const ctx = new AudioContext();
    const gainNode = ctx.createGain();
    const source = ctx.createMediaStreamSource(stream);
    if (gainKey === "microphone") {
      const destination = ctx.createMediaStreamDestination();
      source.connect(gainNode).connect(destination);
      stream.removeTrack(stream.getAudioTracks()[0]);
      stream.addTrack(destination.stream.getAudioTracks()[0]);
    } else {
      source.connect(gainNode).connect(ctx.destination);
    }
    gainNode.gain.value = getValue();

    const onFrame = () => {
      gainNode.gain.linearRampToValueAtTime(getValue(), ctx.currentTime);

      if (gainKey === "microphone") {
        window.requestAnimationFrame(onFrame);
      }
      if (gainKey === "volume" && !this.recvTransport?.closed) {
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
