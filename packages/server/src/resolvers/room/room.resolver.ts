import { UserInputError } from '@nestjs/apollo';
import { Args, Context, Directive, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { GraphQLBigInt } from 'graphql-scalars';
import { Room, RoomUpdateInput, User } from 'src/@generated';
import { createModuleCallLog } from 'src/aspects';
import { CTX_USER } from 'src/consts';
import { RoomCreateInput } from 'src/graphql/types/room-create.input';
import { RoomManager } from 'src/manager';
import { RequestUser } from 'src/modules/auth.module';
import { WebRtcService } from 'src/services';

const ModuleCallLog = createModuleCallLog('RoomResolver');

@Resolver(() => Room)
export class RoomResolver {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly webRtcService: WebRtcService,
    private readonly roomManager: RoomManager,
  ) {}

  @Directive('@user')
  @Mutation(() => Room)
  @ModuleCallLog('创建房间')
  async roomCreate(@Context(CTX_USER) user: RequestUser, @Args('data') data: RoomCreateInput) {
    if (!(await this.roomManager.checkChannelPerimissions(user.userId, data.channelCategoryId, 'ADMIN'))) {
      throw new UserInputError('您没有该频道的管理权限');
    }

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

  @Directive('@user')
  @Mutation(() => Room)
  async roomUpdate(
    @Context(CTX_USER) user: RequestUser,
    @Args('roomId', { type: () => GraphQLBigInt }) roomId: bigint,
    @Args('data', { type: () => RoomUpdateInput }) data: RoomUpdateInput,
  ) {
    if (!(await this.roomManager.checkRoomPermissions(user.userId, roomId, 'ADMIN'))) {
      throw new UserInputError('您没有该频道的管理权限');
    }

    return this.prisma.room.update({
      where: { id: roomId },
      data,
    });
  }

  @Directive('@user')
  @Mutation(() => Room)
  async roomDelete(
    @Context(CTX_USER) user: RequestUser,
    @Args('roomId', { type: () => GraphQLBigInt }) roomId: bigint,
  ) {
    if (!(await this.roomManager.checkRoomPermissions(user.userId, roomId, 'ADMIN'))) {
      throw new UserInputError('您没有该频道的管理权限');
    }

    return this.prisma.room.delete({
      where: { id: roomId },
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
