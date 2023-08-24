import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { WebRtcService } from 'src/services';

@WebSocketGateway(0, {
  cors: true,
})
export class EventsGateway {
  constructor(private readonly webRtcService: WebRtcService) {}

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    console.log(payload, client.id);
    return 'Hello world!';
  }
}
