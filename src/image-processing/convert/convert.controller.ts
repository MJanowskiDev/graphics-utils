import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConvertDto } from './dto/format.dto';
import { SendImage } from '../decorator/SendImage';
import { Response } from 'express';
import { ConvertService } from './convert.service';

@Controller('convert')
export class ConvertController {
  constructor(private convertService: ConvertService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async convertToFormat(
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
    { format }: ConvertDto,
    @SendImage() res: Response,
  ) {
    const { buffer, fileName, mime } =
      await this.convertService.convertToFormat(
        file.buffer,
        format,
        file.originalname,
      );

    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  }
}
