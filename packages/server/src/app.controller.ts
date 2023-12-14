import { Controller, Get, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { WebRtcService } from './services';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';
import { createHash } from 'crypto';
import dayjs = require('dayjs');

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly webRtcService: WebRtcService) {}

  @Post('/file/upload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@UploadedFile() file: Express.Multer.File) {
    this.logger.log(`Upload file, ${file.originalname}`);

    const ext = extname(file.originalname);
    const hash = createHash('md5').update(file.buffer).digest('hex');

    const date = dayjs().format('YYYYMM');
    const fileName = `${hash}${ext}`;
    const fileDir = join(__dirname, '..', 'files', date);
    const filePath = join(fileDir, fileName);

    if (!existsSync(fileDir)) {
      await mkdir(fileDir, { recursive: true });
    }

    await writeFile(filePath, file.buffer);

    return { name: `${date}/${fileName}` };
  }

  @Get('/debug/rooms')
  getHello() {
    return this.webRtcService.getRooms();
  }
}
