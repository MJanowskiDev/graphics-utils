import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { HealthController } from './health.controller';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [HealthController],
  imports: [
    EmailModule,
    HealthModule,
    HttpModule,
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
    }),
  ],
})
export class HealthModule {}
