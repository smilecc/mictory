import { Test, TestingModule } from '@nestjs/testing';
import { RoomManager } from './room.manager';

describe('RoomManager', () => {
  let service: RoomManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomManager],
    }).compile();

    service = module.get<RoomManager>(RoomManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
