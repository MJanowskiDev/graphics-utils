import { Test, TestingModule } from '@nestjs/testing';
import { ResizeController } from './resize.controller';

describe('ResizeController', () => {
  let controller: ResizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResizeController],
    }).compile();

    controller = module.get<ResizeController>(ResizeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
