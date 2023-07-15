import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { APP_GUARD } from '@nestjs/core';

import { ImageProcessingModule } from './image-processing/image-processing.module';
import AwsConfig from './config/aws';
import S3Config from './config/s3-buckets';
import DatabaseConfig from './config/database';
import AuthConfig from './config/auth';
import EmailConfig from './config/email';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './auth/auth.guard';
import { LambdaModule } from './lambda/lambda.module';
import { LoggerModule } from './core/logger/logger.module';
import { ControllerLogger } from './core/logger/ControllerLogger.middleware';
import { RootController } from './root.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<DataSourceOptions> => {
        return configService.get('database') as DataSourceOptions;
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
  controllers: [RootController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ControllerLogger).forRoutes('*');
  }
}
