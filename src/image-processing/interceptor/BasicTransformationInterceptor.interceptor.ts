import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProcessingResult } from '../types';

@Injectable()
export class BasicTransformationInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ProcessingResult | void> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const { fileName, mime, output } = data;

        response.set({
          'Content-Type': mime,
          'Content-Disposition': `attachment; filename=${fileName}`,
        });

        response.status(HttpStatus.OK).send(output);
      }),
      catchError((err) => {
        throw new BadRequestException(err.message);
      }),
    );
  }
}
