import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ConvertDto, ResizeImageDto } from './dto';
import { BasicTransformationsService } from './basic-transformations/basic-transformations.service';
import { FileValidationPipe } from './validation/file-validation.pipe';
import { BasicTransformationInterceptor } from './interceptor/BasicTransformationInterceptor.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProcessingResultDto } from './dto';
import { SwaggerMultiFileBody } from 'src/core/decorator/swagger-files-upload.decorator';
import { File } from './types';

@Controller('image')
@ApiTags('image')
@ApiBearerAuth()
@UseInterceptors(BasicTransformationInterceptor, FilesInterceptor('files'))
export class ImageProcessingController {
  constructor(
    private basicTransformationsService: BasicTransformationsService,
  ) {}

  @Post('resize')
  @SwaggerMultiFileBody
  resize(
    @Query() { width }: ResizeImageDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
  ): Promise<ProcessingResultDto> {
    return this.basicTransformationsService.resize(files, width);
  }

  @Post('convert')
  @SwaggerMultiFileBody
  convert(
    @Query() { format }: ConvertDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
  ): Promise<ProcessingResultDto> {
    return this.basicTransformationsService.formatConversion(files, format);
  }

  @Post('grayscale')
  @SwaggerMultiFileBody
  toGrayscale(
    @UploadedFiles(new FileValidationPipe()) files: File[],
  ): Promise<ProcessingResultDto> {
    return this.basicTransformationsService.toGrayscale(files);
  }
}
