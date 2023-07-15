import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from './core/decorator/public.decorator';
import { RootResponseDto } from './dto/root-response.dto';

@ApiTags('root')
@Controller('')
export class RootController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  getRoot(): RootResponseDto {
    return {
      message: 'Welcome to GraphicsUtils API!',
      author: 'MJanowskiDev',
      serverTime: new Date().toISOString(),
    };
  }
}
