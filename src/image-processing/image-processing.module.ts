import { Module } from '@nestjs/common';
import { ResizeController } from './resize/resize.controller';
import { ResizeService } from './resize/resize.service';
import { ImagesBucketService } from './images-bucket/images-bucket.service';

@Module({
  controllers: [ResizeController],
  providers: [ResizeService, ImagesBucketService],
})
export class ImageProcessingModule {}
