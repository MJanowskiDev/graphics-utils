import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';

import { ImageProcessingModule } from './image-processing/image-processing.module';
import configModuleOptions from './config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './auth/auth.guard';
import { LambdaModule } from './lambda/lambda.module';
import { LoggerModule } from './core/logger/logger.module';
import { ControllerLogger } from './core/logger/ControllerLogger.middleware';
import { RootController } from './root.controller';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
    }),
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
    ConfigModule.forRoot(configModuleOptions),
    AuthModule,
    UsersModule,
    LambdaModule,
    LoggerModule,
    HealthModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [RootController, HealthController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ControllerLogger).forRoutes('*');
  }
}
