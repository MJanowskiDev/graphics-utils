import { Test, TestingModule } from '@nestjs/testing';
import { RootController } from './root.controller';

describe('RootController', () => {
  let rootController: RootController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RootController],
    }).compile();

    rootController = module.get<RootController>(RootController);
  });

  it('should be defined', () => {
    expect(rootController).toBeDefined();
  });

  describe('getRoot', () => {
    it('should return welcome message', () => {
      expect(rootController.getRoot()).toHaveProperty('message');
    });

    it('should return author name', () => {
      expect(rootController.getRoot()).toHaveProperty('author');
    });

    it('should return the server time', () => {
      const result = rootController.getRoot();
      expect(rootController.getRoot()).toHaveProperty('serverTime');
      const date = new Date(result.serverTime);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });
});
