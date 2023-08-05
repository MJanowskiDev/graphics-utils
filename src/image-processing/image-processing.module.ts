import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImagesBucketService } from './images-bucket/images-bucket.service';
import { Asset, OperationData, ImageProcessing } from './entity';
import {
  AssetRepository,
  OperationDataRepository,
  ImageProcessingRepository,
} from './repository';
import { ImageProcessingController } from './image-processing.controller';
import { ProcessingService } from './processing/processing.service';
import { BasicTransformationsService } from './basic-transformations/basic-transformations.service';
import { AdvancedTransformationsService } from './advanced-transformations/advanced-transformations.service';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, OperationData, ImageProcessing])],
  controllers: [ImageProcessingController, EventsController],
  providers: [
    ImagesBucketService,
    AssetRepository,
    OperationDataRepository,
    ImageProcessingRepository,
    ProcessingService,
    BasicTransformationsService,
    AdvancedTransformationsService,
    EventsService,
  ],
})
export class ImageProcessingModule {}
