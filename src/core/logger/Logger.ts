import { ConsoleLogger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { HttpError } from '../errors/HttpError';

export class Logger extends ConsoleLogger {
  log(message: any) {
    super.log(message);
  }

  error(message: any) {
    super.error(message);

    if (message instanceof HttpError) {
      const httpError = message as HttpError;
      Sentry.withScope((scope) => {
        scope.setExtra('body', httpError.body);
        Sentry.captureException(httpError.exception);
      });
    }
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
