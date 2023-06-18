import { Module } from '@nestjs/common';
import { ResizeController } from './resize/resize.controller';
import { ResizeService } from './resize/resize.service';
import { ImagesBucketService } from './images-bucket/images-bucket.service';
import { ConvertController } from './convert/convert.controller';
import { ConvertService } from './convert/convert.service';

@Module({
  controllers: [ResizeController, ConvertController],
  providers: [ResizeService, ImagesBucketService, ConvertService],
})
export class ImageProcessingModule {}
