import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getReasonPhrase } from 'http-status-codes';

import { Logger } from '../logger/Logger';
import { HttpError } from '../errors/HttpError';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HTTP Exception');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(new HttpError(exception, request));

    response.status(status).json({
      statusCode: status,
      message: getReasonPhrase(exception.getStatus()),
      timestamp: new Date().toISOString(),
      path: request.url,
      hostType: host.getType(),
      exception: exception.getResponse(),
    });
  }
}
