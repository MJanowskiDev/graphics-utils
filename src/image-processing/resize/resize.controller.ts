import { Controller, Get } from '@nestjs/common';

@Controller('resize')
export class ResizeController {
  @Get('/healthcheck')
  healthcheck() {
    return {
      status: 'ok',
      timestamp: Date.now(),
      message: 'Service is healthy',
    };
  }
}
