import {
  Controller,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ConvertDto, ResizeImageDto } from './dto';
import { File, ProcessingResult } from './types';
import { BasicTransformationsService } from './basic-transformations/basic-transformations.service';
import { FileValidationPipe } from './validation/file-validation.pipe';

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
  resize(
    @Query() { width }: ResizeImageDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
    @Res() res: Response,
  ) {
    return this.processFiles(
      this.basicTransformationsService.resize(files, width),
      res,
    );
  }

  @Post('convert')
  @UseInterceptors(FilesInterceptor('files'))
  convert(
    @Query() { format }: ConvertDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
    @Res() res: Response,
  ) {
    return this.processFiles(
      this.basicTransformationsService.formatConversion(files, format),
      res,
    );
  }

  @Post('grayscale')
  @UseInterceptors(FilesInterceptor('files'))
  toGrayscale(
    @UploadedFiles(new FileValidationPipe()) files: File[],
    @Res() res: Response,
  ) {
    return this.processFiles(
      this.basicTransformationsService.toGrayscale(files),
      res,
    );
  }
}
