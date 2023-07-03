import { Controller, Get } from '@nestjs/common';
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
}
