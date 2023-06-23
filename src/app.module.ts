import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageProcessingModule } from './image-processing/image-processing.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AwsConfig from './config/aws';
import S3Config from './config/s3-buckets';
import DatabaseConfig from './config/database';
import AuthConfig from './config/auth';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import {
  Asset,
  OperationData,
  ImageProcessing,
} from './image-processing/entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

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
          entities: [Asset, OperationData, ImageProcessing],
          synchronize: true,
        };
      },
    }),
    ImageProcessingModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({
      load: [AwsConfig, S3Config, DatabaseConfig, AuthConfig],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
