import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator, HealthCheck, MemoryHealthIndicator } from '@nestjs/terminus';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';

import { Public } from '../core/decorator/public.decorator';
import { AuthEmailsServiceIndicator } from '../email/auth/auth-email.health';

@ApiTags('health')
@Controller('health')
export class HealthController {
  makeEmailCheckUrl: string;
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly emailsServiceIndicator: AuthEmailsServiceIndicator,
    private readonly configService: ConfigService,
  ) {
    this.makeEmailCheckUrl = this.configService.get('external-routes').makeEmailCheckUrl;
  }

  @Get()
  @HealthCheck()
  @Public()
  @ApiOperation({ summary: 'Check health status of the application' })
  @ApiOkResponse({ description: 'Successfully retrieved health status' })
  async check() {
    const healthCheckResult = await this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
      async () => this.http.pingCheck('s3', 'https://s3.amazonaws.com'),
      async () => this.http.responseCheck('make_test_email_send', this.makeEmailCheckUrl, (res) => res.status === 200),
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
