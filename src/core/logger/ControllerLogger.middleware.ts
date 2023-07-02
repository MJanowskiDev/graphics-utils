import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from './Logger';

@Injectable()
export class ControllerLogger implements NestMiddleware {
  private logger = new Logger('Controller');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, headers, ip } = request;
    const startAt = Date.now();

    this.logger.verbose(`STARTING Method: ${method}  URL: ${originalUrl}`);

    headers['request-startAt'] = startAt.toString();

    response.on('finish', () => {
      const { statusCode } = response;
      const delay = Date.now() - startAt;

      this.logger.verbose(
        `FINISHING Method: ${method}, URL: ${originalUrl}, Code: ${statusCode}, Processing time: ${
          delay / 1000
        }s, IP address: ${ip}`,
      );
    });

    next();
  }
}
