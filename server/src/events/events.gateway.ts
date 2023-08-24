import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import type { Socket } from 'socket.io';

@WebSocketGateway(0, {
  cors: true,
})
export class EventsGateway {
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    console.log(payload, client.id);
    return 'Hello world!';
  }
}
