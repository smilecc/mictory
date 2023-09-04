import { Test, TestingModule } from '@nestjs/testing';
import { RoomResolver } from './room.resolver';

describe('RoomResolver', () => {
  let resolver: RoomResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomResolver],
    }).compile();

    resolver = module.get<RoomResolver>(RoomResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
