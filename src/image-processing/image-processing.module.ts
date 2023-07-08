import { Module } from '@nestjs/common';
import { ResizeService } from './resize/resize.service';
import { ImagesBucketService } from './images-bucket/images-bucket.service';
import { ConvertService } from './convert/convert.service';
import { Asset, OperationData, ImageProcessing } from './entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AssetRepository,
  OperationDataRepository,
  ImageProcessingRepository,
} from './repository';
import { ImageProcessingController } from './image-processing.controller';
import { ProcessingService } from './processing/processing.service';
import { BasicTransformationsService } from './basic-transformations/basic-transformations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, OperationData, ImageProcessing])],
  controllers: [ImageProcessingController],
  providers: [
    ResizeService,
    ImagesBucketService,
    ConvertService,
    AssetRepository,
    OperationDataRepository,
    ImageProcessingRepository,
    ProcessingService,
    BasicTransformationsService,
  ],
})
export class ImageProcessingModule {}
