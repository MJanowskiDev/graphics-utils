import { LoggerService } from '@nestjs/common';
import * as Sentry from '@sentry/node';

export class Logger implements LoggerService {
  log(message: any) {
    console.log(message);
    Sentry.captureMessage(message, { level: 'log' });
  }

  error(message: any) {
    console.error(message);
    Sentry.captureException(new Error(message));
  }

  warn(message: any) {
    console.warn(message);
    Sentry.captureMessage(message, { level: 'warning' });
  }

  debug(message: any) {
    console.debug(message);
    this.log(message);
  }

  verbose(message: any) {
    console.info(message);
    this.log(message);
  }
}
