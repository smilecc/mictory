import { Test, TestingModule } from '@nestjs/testing';
import { UserFriendResolver } from './user-friend.resolver';

describe('UserFriendResolver', () => {
  let resolver: UserFriendResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFriendResolver],
    }).compile();

    resolver = module.get<UserFriendResolver>(UserFriendResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
