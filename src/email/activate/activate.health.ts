import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicator,
  HealthCheckError,
} from '@nestjs/terminus';

import { ActivateService } from './activate.service';

@Injectable()
export class EmailsServiceIndicator extends HealthIndicator {
  constructor(private readonly activateService: ActivateService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.activateService.verifyEmailService();

    const result = this.getStatus(key, isHealthy, {
      transporterVerification: isHealthy ? 'success' : 'failed',
    });

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Failed transporter', result);
  }
}
