import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ConvertDto, ResizeImageDto } from './dto';
import { File } from './types';
import { BasicTransformationsService } from './basic-transformations/basic-transformations.service';
import { FileValidationPipe } from './validation/file-validation.pipe';
import { BasicTransformationInterceptor } from './interceptor/BasicTransformationInterceptor.interceptor';

@Controller('image')
@UseInterceptors(BasicTransformationInterceptor, FilesInterceptor('files'))
export class ImageProcessingController {
  constructor(
    private basicTransformationsService: BasicTransformationsService,
  ) {}

  @Post('resize')
  resize(
    @Query() { width }: ResizeImageDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
  ) {
    return this.basicTransformationsService.resize(files, width);
  }

  @Post('convert')
  convert(
    @Query() { format }: ConvertDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
  ) {
    return this.basicTransformationsService.formatConversion(files, format);
  }

  @Post('grayscale')
  toGrayscale(@UploadedFiles(new FileValidationPipe()) files: File[]) {
    return this.basicTransformationsService.toGrayscale(files);
  }
}
