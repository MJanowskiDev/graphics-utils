import { Module } from '@nestjs/common';
import { ResizeController } from './resize/resize.controller';
import { ResizeService } from './resize/resize.service';
import { ImagesBucketService } from './images-bucket/images-bucket.service';
import { ConvertController } from './convert/convert.controller';
import { ConvertService } from './convert/convert.service';
import { Asset } from './entity/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from './repository/asset.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  controllers: [ResizeController, ConvertController],
  providers: [
    ResizeService,
    ImagesBucketService,
    ConvertService,
    AssetRepository,
  ],
})
export class ImageProcessingModule {}
