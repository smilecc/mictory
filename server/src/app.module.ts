import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { PrismaClient } from '@prisma/client';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';
import { WebRtcService } from './services/web-rtc.service';

const prisma = new PrismaClient();
prisma.$use(
  createSoftDeleteMiddleware({
    models: {
      User: true,
    },
    defaultConfig: {
      field: 'deletedTime',
      createValue: (deleted) => {
        if (deleted) return new Date();
        return null;
      },
    },
  }),
);

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    EventsGateway,
    {
      provide: PrismaClient,
      useValue: prisma,
    },
    WebRtcService,
  ],
})
export class AppModule {}
