import { ConsoleLogger } from '@nestjs/common';
import * as Sentry from '@sentry/node';

export class Logger extends ConsoleLogger {
  log(message: any) {
    super.log(message);
  }

  error(message: any) {
    super.error(message);
    Sentry.captureMessage(message, { level: 'error' });
  }

  warn(message: any) {
    super.warn(message);
    Sentry.captureMessage(message, { level: 'warning' });
  }

  debug(message: any) {
    super.debug(message);
    Sentry.captureMessage(message, { level: 'debug' });
  }

  verbose(message: any) {
    super.verbose(message);
    Sentry.captureMessage(message, { level: 'info' });
  }
}
