import { makeAutoObservable } from "mobx";
import { ListUserChannelQuery } from "@/@generated/graphql";
import { socketClient } from "@/contexts";
import * as mediasoupClient from "mediasoup-client";
import type { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/types";

export class ChannelStore {
  constructor() {
    makeAutoObservable(this);

    this.mediasoupDevice = new mediasoupClient.Device();
    socketClient.on("connect", this.handleSocketConnect);
    socketClient.on("disconnect", this.handleSocketDisconnect);
  }

  firstLoading: boolean = true;
  user: ListUserChannelQuery["user"] = undefined;

  // mediasoup设备
  mediasoupDevice: mediasoupClient.Device;

  // 消费者连接
  recvTransport?: Transport;

  // 生产者连接
  sendTransport?: Transport;

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

  async joinRoom(roomId: number) {
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

    sendTransport.on("connectionstatechange", (state) => console.log("send:connectionstatechange", state, roomId));
  }

  createTransportAndProducer() {}

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

    console.log("consumeProducer:consumer", consumer.id, "producerId", producerId);
  }

  async createProducer(stream: MediaStream) {
    if (!this.sendTransport) {
      console.log("创建生产者失败，sendTransport为空", stream.id, stream);
      return;
    }

    const producer = await this.sendTransport.produce({
      track: stream.getTracks()[0],
    });

    console.log("createProducer:producer", producer.id);
  }
}
