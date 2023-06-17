import {
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResizeService } from './resize.service';
import { Response } from 'express';
import { ResizeImageDto } from './dto/resize.dto';
import { SendImage } from '../decorator/SendImage';

@Controller('resize')
export class ResizeController {
  constructor(private resizeService: ResizeService) {}

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
  async resizeImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /png|jpeg|gif|webp|avif|tiff/,
        })
        .addMaxSizeValidator({
          maxSize: 100000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Query(new ValidationPipe({ transform: true }))
    { width }: ResizeImageDto,
    @SendImage() res: Response,
  ) {
    res.send(
      await this.resizeService.resize(file.buffer, width, file.originalname),
    );
  }
}
