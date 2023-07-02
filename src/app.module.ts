import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ImageProcessingModule } from './image-processing/image-processing.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AwsConfig from './config/aws';
import S3Config from './config/s3-buckets';
import DatabaseConfig from './config/database';
import AuthConfig from './config/auth';
import EmailConfig from './config/email';
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
import { User } from './users/entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { LambdaModule } from './lambda/lambda.module';
import { LoggerModule } from './core/logger/logger.module';
import { ControllerLogger } from './core/logger/ControllerLogger.middleware';

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
          entities: [Asset, OperationData, ImageProcessing, User],
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
      load: [AwsConfig, S3Config, DatabaseConfig, AuthConfig, EmailConfig],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    LambdaModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ControllerLogger).forRoutes('*');
  }
}
