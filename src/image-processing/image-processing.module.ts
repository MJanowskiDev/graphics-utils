import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResizeController } from './resize/resize.controller';
import { ResizeService } from './resize/resize.service';
import { ImagesBucketService } from './images-bucket/images-bucket.service';
import { ConvertController } from './convert/convert.controller';
import { ConvertService } from './convert/convert.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<DataSourceOptions> => {
        const { dbHost, dbPort, dbUsername, dbPassword, dbType, dbName } =
          configService.get('database');
        return {
          type: dbType,
          host: dbHost,
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbName,
          entities: [],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [ResizeController, ConvertController],
  providers: [ResizeService, ImagesBucketService, ConvertService],
})
export class ImageProcessingModule {}
