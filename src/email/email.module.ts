import { Module } from '@nestjs/common';

import { AuthEmailService } from './auth/auth-email.service';
import { AuthEmailsServiceIndicator } from './auth/auth-email.health';

@Module({
  providers: [AuthEmailService, AuthEmailsServiceIndicator],
  exports: [AuthEmailService, AuthEmailsServiceIndicator],
})
export class EmailModule {}
