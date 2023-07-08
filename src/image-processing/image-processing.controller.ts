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
import { ConvertDto } from './convert/dto/format.dto';
import { File, ProcessingResult } from './types';
import { BasicTransformationsService } from './basic-transformations/basic-transformations.service';

@Controller('image')
export class ImageProcessingController {
  constructor(
    private basicTransformationsService: BasicTransformationsService,
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
      this.basicTransformationsService.resize(files, width),
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
      this.basicTransformationsService.formatConversion(files, format),
      res,
    );
  }

  @Post('grayscale')
  @UseInterceptors(FilesInterceptor('files'))
  async toGrayscale(@UploadedFiles() files: File[], @Res() res: Response) {
    if (!files?.length) {
      throw new BadRequestException('Cannot convert files, empty files array');
    }

    return await this.processFiles(
      this.basicTransformationsService.toGrayscale(files),
      res,
    );
  }
}
