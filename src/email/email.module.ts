import { Module } from '@nestjs/common';
import { ActivateService } from './activate/activate.service';

@Module({
  providers: [ActivateService],
  exports: [ActivateService],
})
export class EmailModule {}
