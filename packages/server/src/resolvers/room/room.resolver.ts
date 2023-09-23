import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { Room, User } from 'src/@generated';
import { WebRtcService } from 'src/services';

@Resolver(() => Room)
export class RoomResolver {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly webRtcService: WebRtcService,
  ) {}

  @Mutation(() => Room)
  async roomCreate() {}

  @ResolveField(() => [User])
  async users(@Parent() room: Room) {
    const rtcRoom = await this.webRtcService.getRoom(parseInt(room.id.toString()));
    const userIds = rtcRoom.sessions.map((it) => it.userId);
    return this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
  }
}
