import {
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResizeService } from './resize.service';
import { Response } from 'express';
import { ResizeImageDto } from './dto/resize.dto';

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
          fileType: 'png',
        })
        .addMaxSizeValidator({
          maxSize: 100000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Res() res: Response,
    @Query(new ValidationPipe({ transform: true }))
    { width }: ResizeImageDto,
  ) {
    const resizedBuffer = await this.resizeService.resize(file.buffer, width);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="resized.png"');
    res.send(resizedBuffer);
  }
}
