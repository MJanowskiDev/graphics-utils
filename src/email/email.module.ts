import { Module } from '@nestjs/common';

import { ActivateService } from './activate/activate.service';
import { EmailsServiceIndicator } from './activate/activate.health';

@Module({
  providers: [ActivateService, EmailsServiceIndicator],
  exports: [ActivateService, EmailsServiceIndicator],
})
export class EmailModule {}
