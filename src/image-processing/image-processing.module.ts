import { Module } from '@nestjs/common';
import { ResizeController } from './resize/resize.controller';
import { ResizeService } from './resize/resize.service';
import { ImagesBucketService } from './images-bucket/images-bucket.service';
import { ConvertController } from './convert/convert.controller';
import { ConvertService } from './convert/convert.service';
import { Asset, OperationData, ImageProcessing } from './entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository, OperationDataRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, OperationData, ImageProcessing])],
  controllers: [ResizeController, ConvertController],
  providers: [
    ResizeService,
    ImagesBucketService,
    ConvertService,
    AssetRepository,
    OperationDataRepository,
  ],
})
export class ImageProcessingModule {}
