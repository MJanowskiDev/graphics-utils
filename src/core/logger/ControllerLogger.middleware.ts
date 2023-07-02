import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from './Logger';

@Injectable()
export class ControllerLogger implements NestMiddleware {
  private logger = new Logger('Controller');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, headers, ip } = request;
    const startAt = Date.now();

    headers['request-startAt'] = startAt.toString();

    response.on('finish', () => {
      const { statusCode } = response;
      const delay = Date.now() - startAt;

      this.logger.verbose(`Method: ${method}  
                          URL: ${originalUrl} 
                          Response code: ${statusCode}
                          Request was started at: ${new Date(
                            startAt,
                          ).toLocaleString()} 
                          Request processing time: ${delay / 1000}s
                          IP address: ${ip}`);
    });

    next();
  }
}
