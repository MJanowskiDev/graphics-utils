import { Test, TestingModule } from '@nestjs/testing';
import { ImagesBucketService } from './images-bucket.service';

describe('ImagesBucketService', () => {
  let service: ImagesBucketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesBucketService],
    }).compile();

    service = module.get<ImagesBucketService>(ImagesBucketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
