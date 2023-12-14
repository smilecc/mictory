import { Args, Context, Directive, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { Room, User } from 'src/@generated';
import { CTX_USER } from 'src/consts';
import { RoomCreateInput } from 'src/graphql/types/room-create.input';
import { RequestUser } from 'src/modules/auth.module';
import { WebRtcService } from 'src/services';

@Resolver(() => Room)
export class RoomResolver {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly webRtcService: WebRtcService,
  ) {}

  @Directive('@user')
  @Mutation(() => Room)
  async roomCreate(@Context(CTX_USER) user: RequestUser, @Args('data') data: RoomCreateInput) {
    return this.prisma.room.create({
      data: {
        name: data.name,
        channelCategory: {
          connect: {
            id: data.channelCategoryId,
          },
        },
        channel: {
          connect: {
            id: data.channelId,
          },
        },
      },
    });
  }

  @ResolveField(() => [User])
  async users(@Parent() room: Room) {
    const rtcRoom = await this.webRtcService.getRoom(parseInt(room.id.toString()));
    const userIds = rtcRoom.sessions.map((it) => it.userId);
    return this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
  }
}
