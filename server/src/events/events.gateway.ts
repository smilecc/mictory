import { MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';
import type { Socket } from 'socket.io';
import { WebRtcService } from 'src/services';
import { MictorySocket } from './socket.adapter';
import { Logger } from '@nestjs/common';
import { MessageGetRouterRtpCapabilities, MessageJoinRoom } from 'src/types';
import { Client } from 'socket.io/dist/client';

@WebSocketGateway(0, {
  cors: true,
})
export class EventsGateway implements OnGatewayDisconnect {
  constructor(private readonly webRtcService: WebRtcService) {}
  handleDisconnect(client: MictorySocket) {
    Logger.log(`[${client.id}] disconnect`);
  }

  @SubscribeMessage('getRouterRtpCapabilities')
  getRouterRtpCapabilities(@MessageBody() payload: MessageGetRouterRtpCapabilities) {
    return this.webRtcService.getWorkerByRoomId(payload.roomId).appData.router.rtpCapabilities;
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(socket: MictorySocket, @MessageBody() payload: MessageJoinRoom) {
    const roomSession = await this.webRtcService.joinRoom(payload.roomId, BigInt(socket.user.userId));
    return roomSession;
    // const transportToResponse = (transport: WebRtcTransport) => ({
    //   id: transport.id,
    //   iceParameters: transport.iceParameters,
    //   iceCandidates: transport.iceCandidates,
    //   dtlsParameters: transport.dtlsParameters,
    //   sctpParameters: transport.sctpParameters,
    // });

    // return {
    //   sessionId: session.id,
    //   recvTransport: transportToResponse(session.recvTransport),
    //   sendTransport: transportToResponse(session.sendTransport),
    // };
  }

  @SubscribeMessage('createTransport')
  async createTransport(@MessageBody() payload: any) {}

  // @SubscribeMessage('connectTransport')
  // async connectTransport(@MessageBody() payload: Record<string, any>) {
  //   const room = this.webRtcService.getRoom(1);
  //   const session = room.sessions.find((it) => it.userId == payload.userId);

  //   let transport: WebRtcTransport;
  //   if (payload.send) {
  //     transport = session.sendTransport;
  //   } else {
  //     transport = session.recvTransport;
  //   }

  //   console.log(payload, transport.id);
  //   await transport.connect({ dtlsParameters: payload.dtlsParameters });
  //   return { id: transport.id };
  // }

  // @SubscribeMessage('produceTransport')
  // async produceTransport(@MessageBody() payload: Record<string, any>) {
  //   console.log('produceTransport', payload);
  //   const room = this.webRtcService.getRoom(1);
  //   const session = room.sessions.find((it) => it.userId == payload.userId);
  //   const producer = await session.sendTransport.produce({
  //     kind: payload.kind,
  //     rtpParameters: payload.rtpParameters,
  //   });

  //   return {
  //     id: producer.id,
  //   };
  // }

  // @SubscribeMessage('consumeTransport')
  // async consumeTransport(@MessageBody() payload: Record<string, any>) {
  //   console.log('consumeTransport', payload);
  //   const room = this.webRtcService.getRoom(1);
  //   const session = room.sessions.find((it) => it.userId == payload.userId);
  //   const producer = await transport.produce({
  //     kind: payload.kind,
  //     rtpParameters: payload.rtpParameters,
  //   });

  //   return {
  //     id: producer.id,
  //   };
  // }
}
