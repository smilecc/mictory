import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { WebRtcService } from 'src/services';

@WebSocketGateway(0, {
  cors: true,
})
export class EventsGateway {
  constructor(private readonly webRtcService: WebRtcService) {}

  @SubscribeMessage('getRouterRtpCapabilities')
  getRouterRtpCapabilities() {
    return this.webRtcService.router.rtpCapabilities;
  }

  @SubscribeMessage('createWebRtcTransport')
  async createWebRtcTransport() {
    const transport = await this.webRtcService.router.createWebRtcTransport({
      enableTcp: true,
      enableUdp: true,
      preferUdp: true,
      webRtcServer: this.webRtcService.rtcServer,
    });

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    };
  }

  @SubscribeMessage('connectTransport')
  async connectTransport(@MessageBody() payload: Record<string, any>) {
    console.log(payload);
    this.webRtcService.router;
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    console.log(payload, client.id);
    return 'Hello world!';
  }
}
