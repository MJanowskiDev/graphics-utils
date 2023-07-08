import {
  BadRequestException,
  Controller,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResizeImageDto } from './resize/dto/resize.dto';
import { Response } from 'express';
import { ResizeService } from './resize/resize.service';
import { ConvertDto } from './convert/dto/format.dto';
import { ConvertService } from './convert/convert.service';
import { File, ProcessingResult } from './types';

@Controller('image')
export class ImageProcessingController {
  constructor(
    private resizeService: ResizeService,
    private convertService: ConvertService,
  ) {}

  private async processFiles(
    processingTask: Promise<ProcessingResult>,
    res: Response,
  ) {
    const processingResult = await processingTask;

    res.set({
      'Content-Type': processingResult.mime,
      'Content-Disposition': `attachment; filename=${processingResult.fileName}`,
    });
    res.send(processingResult.output);
  }

  @Post('resize')
  @UseInterceptors(FilesInterceptor('files'))
  async resize(
    @Query(new ValidationPipe({ transform: true })) { width }: ResizeImageDto,
    @UploadedFiles() files: File[],
    @Res() res: Response,
  ) {
    if (!files?.length) {
      throw new BadRequestException('Cannot convert files, empty files array');
    }

    return await this.processFiles(
      this.resizeService.resize(files, width),
      res,
    );
  }

  @Post('convert')
  @UseInterceptors(FilesInterceptor('files'))
  async convert(
    @Query(new ValidationPipe({ transform: true })) { format }: ConvertDto,
    @UploadedFiles() files: File[],
    @Res() res: Response,
  ) {
    if (!files?.length) {
      throw new BadRequestException('Cannot convert files, empty files array');
    }

    return await this.processFiles(
      this.convertService.convert(files, format),
      res,
    );
  }
}
