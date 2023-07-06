import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Public } from './core/decorator/public.decorator';

@Controller('')
export class RootController {
  @Public()
  @Get()
  getRoot(): any {
    return {
      message: 'Welcome to GraphicsUtils API!',
      author: 'MJanowskiDev',
      serverTime: new Date().toISOString(),
    };
  }

  @Public()
  @Post('sentry-debug')
  sentryDebug(response: Response) {
    throw new HttpException(response, HttpStatus.TOO_MANY_REQUESTS);
  }
}
