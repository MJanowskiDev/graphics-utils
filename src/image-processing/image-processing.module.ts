import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
import { UserMiddleware } from '../core/middleware/user-jwt.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, OperationData, ImageProcessing]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth').authJwtSecret,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
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
export class ImageProcessingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes(EventsController, ImageProcessingController);
  }
}
