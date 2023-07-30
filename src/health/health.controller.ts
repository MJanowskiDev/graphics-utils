import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import moment from 'moment';

import { Public } from '../core/decorator/public.decorator';
import { EmailsServiceIndicator } from '../email/activate/activate.health';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly emailsServiceIndicator: EmailsServiceIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  @ApiOperation({ summary: 'Check health status of the application' })
  @ApiOkResponse({ description: 'Successfully retrieved health status' })
  async check() {
    const healthCheckResult = await this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
      async () => this.http.pingCheck('s3', 'https://s3.amazonaws.com'),
      async () => this.emailsServiceIndicator.isHealthy('emails_service'),
      async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
    ]);

    return {
      serverTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
      ...healthCheckResult,
    };
  }
}
