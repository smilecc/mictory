import { Controller, Get } from '@nestjs/common';
import { WebRtcService } from './services';

@Controller()
export class AppController {
  constructor(private readonly webRtcService: WebRtcService) {}

  @Get('/debug/rooms')
  getHello() {
    return this.webRtcService.getRooms();
  }
}
