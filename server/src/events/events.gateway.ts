import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebRtcService } from 'src/services';
import { MictorySocket } from './socket.adapter';
import { Logger } from '@nestjs/common';
import {
  MessageConnectTransport,
  MessageConsumeTransport,
  MessageCreateTransport,
  MessageGetRouterRtpCapabilities,
  MessageJoinRoom,
  MessageProduceTransport,
  RoomId,
} from 'src/types';

const socketRoomKey = (roomId: RoomId) => `ROOM_${roomId}`;

@WebSocketGateway(0, {
  cors: {
    origin: true,
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayDisconnect {
  constructor(private readonly webRtcService: WebRtcService) {}
  handleDisconnect(client: MictorySocket) {
    Logger.log(`[${client.id}, User: ${client.user.userId}] disconnect`, 'EventsGateway');
    if (client.mediasoupRoomId) {
      // 关闭连接时退出房间
      this.webRtcService.exitRoom(client.mediasoupRoomId, BigInt(client.user.userId));
      client.leave(socketRoomKey(client.mediasoupRoomId));
      client.mediasoupRoomId = undefined;
    }
  }

  @SubscribeMessage('getRouterRtpCapabilities')
  getRouterRtpCapabilities(@MessageBody() payload: MessageGetRouterRtpCapabilities) {
    return this.webRtcService.getWorkerByRoomId(payload.roomId).appData.router.rtpCapabilities;
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@ConnectedSocket() socket: MictorySocket, @MessageBody() payload: MessageJoinRoom) {
    const userId = BigInt(socket.user.userId);
    // 退出之前的房间
    if (socket.mediasoupRoomId) {
      this.webRtcService.exitRoom(socket.mediasoupRoomId, userId);
      socket.leave(socketRoomKey(socket.mediasoupRoomId));
    }

    const roomSession = await this.webRtcService.joinRoom(payload.roomId, BigInt(socket.user.userId));
    socket.join(socketRoomKey(payload.roomId));
    socket.mediasoupRoomId = roomSession.roomId;
    return roomSession;
  }

  @SubscribeMessage('createTransport')
  async createTransport(socket: MictorySocket, payload: MessageCreateTransport) {
    if (!socket.mediasoupRoomId) {
      Logger.error(`CreateTransport Fail, socket.mediasoupRoomId is undefined`, 'EventsGateway');
      return;
    }

    const transport = await this.webRtcService.createTransport(
      socket.mediasoupRoomId,
      BigInt(socket.user.userId),
      payload.direction,
    );

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    };
  }

  @SubscribeMessage('connectTransport')
  async connectTransport(socket: MictorySocket, payload: MessageConnectTransport) {
    if (!socket.mediasoupRoomId) {
      Logger.error(`ConnectTransport Fail, socket.mediasoupRoomId is undefined`, 'EventsGateway');
      return;
    }

    const userId = BigInt(socket.user.userId);
    const sessionTransport = this.webRtcService.getTransport(socket.mediasoupRoomId, userId, payload.transportId);

    Logger.log(`ConnectTransport, User: ${socket.user.userId} TransportId: ${payload?.transportId}`);
    await sessionTransport?.transport?.connect({ dtlsParameters: payload.dtlsParameters });

    return { id: payload.transportId };
  }

  @SubscribeMessage('produceTransport')
  async produceTransport(socket: MictorySocket, payload: MessageProduceTransport) {
    if (!socket.mediasoupRoomId) {
      Logger.error(`ProduceTransport Fail, socket.mediasoupRoomId is undefined`, 'EventsGateway');
      return;
    }

    const userId = BigInt(socket.user.userId);
    const sessionTransport = this.webRtcService.getTransport(socket.mediasoupRoomId, userId, payload.transportId);

    const producer = await sessionTransport.transport.produce({
      kind: payload.kind,
      rtpParameters: payload.rtpParameters,
    });

    // 通知房间中的其他客户端有新生产者
    socket.broadcast.to(socketRoomKey(socket.mediasoupRoomId)).emit('newProducer', {
      producerId: producer.id,
    });

    sessionTransport.producer = producer;
    producer.on('@close', () => {
      Logger.log(`ProducerClosed, Producer: ${producer.id} User: ${userId}`);
      sessionTransport.producer = undefined;
    });

    Logger.log(
      `ProduceTransport, User: ${socket.user.userId} TransportId: ${payload?.transportId} ProducerId: ${producer.id}`,
    );

    return {
      id: producer.id,
    };
  }

  @SubscribeMessage('consumeTransport')
  async consumeTransport(socket: MictorySocket, payload: MessageConsumeTransport) {
    if (!socket.mediasoupRoomId) {
      Logger.error(`ConsumeTransport Fail, socket.mediasoupRoomId is undefined`, 'EventsGateway');
      return;
    }

    const userId = BigInt(socket.user.userId);
    const sessionTransport = this.webRtcService.getTransport(socket.mediasoupRoomId, userId, payload.transportId);

    const consumer = await sessionTransport.transport.consume({
      producerId: payload.producerId,
      rtpCapabilities: payload.rtpCapabilities,
    });

    // sessionTransport.consumer = consumer;
    // consumer.on('@close', () => {
    //   Logger.log(`ConsumerClosed, Consumer: ${consumer.id} User: ${userId}`);
    //   sessionTransport.consumer = undefined;
    // });

    Logger.log(
      `ConsumeTransport, User: ${socket.user.userId} TransportId: ${payload?.transportId} ProducerId: ${payload.producerId}`,
    );

    return {
      id: consumer.id,
      kind: consumer.kind,
      producerId: consumer.producerId,
      rtpParameters: consumer.rtpParameters,
    };
  }

  @SubscribeMessage('getRoomProducers')
  async getRoomProducers(socket: MictorySocket) {
    if (!socket.mediasoupRoomId) {
      Logger.error(`GetRoomProducers Fail, socket.mediasoupRoomId is undefined`, 'EventsGateway');
      return;
    }

    const room = this.webRtcService.getRoom(socket.mediasoupRoomId);
    const producers = room.sessions
      .filter((it) => it.userId !== BigInt(socket.user.userId))
      .flatMap((it) => it.transports)
      .filter((it) => it.direction === 'Producer' && it.producer)
      .map((it) => it.producer.id);

    return producers;
  }
}
