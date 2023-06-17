import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageProcessingModule } from './image-processing/image-processing.module';
import { ConfigModule } from '@nestjs/config';
import AwsConfig from './config/aws';
import S3Config from './config/s3-buckets';

@Module({
  imports: [
    ImageProcessingModule,
    ConfigModule.forRoot({
      load: [AwsConfig, S3Config],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
