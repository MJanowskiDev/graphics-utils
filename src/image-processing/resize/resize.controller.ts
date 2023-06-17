import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('resize')
export class ResizeController {
  @Get('/healthcheck')
  healthcheck() {
    return {
      status: 'ok',
      timestamp: Date.now(),
      message: 'Service is healthy',
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  resizeImage(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
