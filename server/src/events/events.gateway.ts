import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';
import type { Socket } from 'socket.io';
import { WebRtcService } from 'src/services';

@WebSocketGateway(0, {
  cors: true,
})
export class EventsGateway {
  constructor(private readonly webRtcService: WebRtcService) {}

  @SubscribeMessage('getRouterRtpCapabilities')
  getRouterRtpCapabilities() {
    return this.webRtcService.getWorkerByRoomId(1).appData.router.rtpCapabilities;
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@MessageBody() payload: Record<string, any>) {
    const session = await this.webRtcService.joinRoom(1, payload.userId);
    const transportToResponse = (transport: WebRtcTransport) => ({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    });

    return {
      sessionId: session.id,
      recvTransport: transportToResponse(session.recvTransport),
      sendTransport: transportToResponse(session.sendTransport),
    };
  }

  @SubscribeMessage('connectTransport')
  async connectTransport(@MessageBody() payload: Record<string, any>) {
    const room = this.webRtcService.getRoom(1);
    const session = room.sessions.find((it) => it.userId == payload.userId);

    let transport: WebRtcTransport;
    if (payload.send) {
      transport = session.sendTransport;
    } else {
      transport = session.recvTransport;
    }

    console.log(payload, transport.id);
    await transport.connect({ dtlsParameters: payload.dtlsParameters });
    return { id: transport.id };
  }

  @SubscribeMessage('produceTransport')
  async produceTransport(@MessageBody() payload: Record<string, any>) {
    console.log('produceTransport', payload);
    const room = this.webRtcService.getRoom(1);
    const session = room.sessions.find((it) => it.userId == payload.userId);
    const producer = await session.sendTransport.produce({
      kind: payload.kind,
      rtpParameters: payload.rtpParameters,
    });

    return {
      id: producer.id,
    };
  }

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
