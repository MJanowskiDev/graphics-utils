import { HttpException } from '@nestjs/common';
import { getReasonPhrase } from 'http-status-codes';
import { Request } from 'express';

export class HttpError extends Error {
  constructor(public exception: HttpException, request: Request, public body?: any) {
    super();
    const statusCode = exception.getStatus();
    const { method, originalUrl } = request;

    const message = `Method: ${method}, URL: ${originalUrl}, Code: ${statusCode} ${getReasonPhrase(statusCode)} `;
    this.message = message;
    this.stack = exception?.stack;
    this.exception = exception;
    this.body = request.body;
  }
}
