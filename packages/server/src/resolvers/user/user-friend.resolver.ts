import { Resolver } from '@nestjs/graphql';
import { UserFriend } from 'src/@generated';

@Resolver(() => UserFriend)
export class UserFriendResolver {}
